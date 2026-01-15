import { dedent } from 'ts-dedent';

import { AwsOptions } from '@/generators/addons/aws';
import {
  isAwsModuleAdded,
  requireAwsModules,
} from '@/generators/addons/aws/dependencies';
import {
  INFRA_CORE_DATA_PATH,
  INFRA_CORE_LOCALS_PATH,
  INFRA_CORE_MAIN_PATH,
  INFRA_CORE_OUTPUTS_PATH,
  INFRA_CORE_VARIABLES_PATH,
  MODULES_LOCALS_INDICATOR,
} from '@/generators/terraform/constants';
import { appendToFile, copy, injectToFile } from '@/helpers/file';

import {
  AWS_SECURITY_GROUP_MAIN_PATH,
  AWS_SECURITY_GROUP_OUTPUTS_PATH,
  AWS_TEMPLATE_PATH,
} from '../constants';

const albLocalesContent = dedent`
    ###ALB Locals###
    alb_s3_bucket_policy = {
      Version = "2012-10-17"
      Statement = [
        {
          Effect = "Allow"
          Principal = {
            AWS = [
              "\${data.aws_elb_service_account.elb_service_account.arn}"
            ]
          }
          Action   = "s3:PutObject"
          Resource = "arn:aws:s3:::\${module.s3_alb_access_log.aws_s3_bucket_name}/AWSLogs/*"
        },
        {
          Effect = "Allow",
          Principal = {
            Service = "delivery.logs.amazonaws.com"
          }
          Action   = "s3:PutObject"
          Resource = "arn:aws:s3:::\${module.s3_alb_access_log.aws_s3_bucket_name}/AWSLogs/*",
          Condition = {
            StringEquals = {
              "s3:x-amz-acl" = "bucket-owner-full-control"
            }
          }
        },
        {
          Effect = "Allow",
          Principal = {
            Service = "delivery.logs.amazonaws.com"
          }
          Action   = "s3:GetBucketAcl"
          Resource = "arn:aws:s3:::\${module.s3_alb_access_log.aws_s3_bucket_name}"
        }
      ]
    }`;

const albDataContent = dedent`
  ###ALB Locals###
  data "aws_elb_service_account" "elb_service_account" {}`;

const albVariablesContent = dedent`
  variable "health_check_path" {
    description = "Application health check path"
    type        = string
  }

  variable "domain" {
    description = "Application domain"
    type        = string
  }`;

const albModuleContent = dedent`
  module "s3_alb_access_log" {
    source = "../modules/s3"

    env_namespace = local.env_namespace
    bucket_name   = "\${local.env_namespace}-alb-access-logs-\${data.aws_caller_identity.current.account_id}"
    force_destroy = true
  }

  module "alb" {
    source = "../modules/alb"

    vpc_id                 = module.vpc.vpc_id
    env_namespace          = local.env_namespace
    app_port               = var.app_port
    subnet_ids             = module.vpc.public_subnet_ids
    security_group_ids     = module.security_group.alb_security_group_ids
    health_check_path      = var.health_check_path
    bucket_access_log_name = module.s3_alb_access_log.aws_s3_bucket_name
  }

  module "s3_bucket_access_log_policy" {
    source = "../modules/s3/bucket_policy"

    s3_bucket_name = module.s3_alb_access_log.aws_s3_bucket_name
    s3_bucket_policy = local.alb_s3_bucket_policy
  }`;

const albOutputsContent = dedent`
  output "alb_dns_name" {
    description = "ALB DNS"
    value       = module.alb.alb_dns_name
  }`;

const albSGMainContent = dedent`
  resource "aws_security_group" "alb" {
    name        = "\${var.env_namespace}-alb-sg"
    description = "ALB Security Group"
    vpc_id      = var.vpc_id

    tags = {
      Name = "\${var.env_namespace}-alb-sg"
    }
  }

  # trivy:ignore:AVD-AWS-0107
  resource "aws_security_group_rule" "alb_ingress_https" {
    type              = "ingress"
    security_group_id = aws_security_group.alb.id
    protocol          = "tcp"
    from_port         = 443
    to_port           = 443
    cidr_blocks       = ["0.0.0.0/0"]
    description       = "From HTTPS to ALB"
  }

  # trivy:ignore:AVD-AWS-0107
  resource "aws_security_group_rule" "alb_ingress_http" {
    type              = "ingress"
    security_group_id = aws_security_group.alb.id
    protocol          = "tcp"
    from_port         = 80
    to_port           = 80
    cidr_blocks       = ["0.0.0.0/0"]
    description       = "From HTTP to ALB"
  }

  # trivy:ignore:AVD-AWS-0104
  resource "aws_security_group_rule" "alb_egress" {
    type              = "egress"
    security_group_id = aws_security_group.alb.id
    protocol          = "tcp"
    from_port         = var.app_port
    to_port           = var.app_port
    cidr_blocks       = ["0.0.0.0/0"]
    description       = "From ALB to app"
  }`;

const albSGOutputsContent = dedent`
  output "alb_security_group_ids" {
    description = "Security group IDs for ALB"
    value       = [aws_security_group.alb.id]
  }`;

const applyAwsAlb = async (options: AwsOptions) => {
  if (isAwsModuleAdded('alb', options.projectName)) {
    return;
  }
  await requireAwsModules('alb', 'securityGroup', options);

  copy(`${AWS_TEMPLATE_PATH}/modules/alb`, 'modules/alb', options.projectName);
  injectToFile(INFRA_CORE_LOCALS_PATH, albLocalesContent, options.projectName, {
    insertAfter: MODULES_LOCALS_INDICATOR,
  });
  appendToFile(INFRA_CORE_DATA_PATH, albDataContent, options.projectName);
  appendToFile(INFRA_CORE_MAIN_PATH, albModuleContent, options.projectName);
  appendToFile(
    INFRA_CORE_VARIABLES_PATH,
    albVariablesContent,
    options.projectName
  );
  appendToFile(INFRA_CORE_OUTPUTS_PATH, albOutputsContent, options.projectName);
  appendToFile(
    AWS_SECURITY_GROUP_MAIN_PATH,
    albSGMainContent,
    options.projectName
  );
  appendToFile(
    AWS_SECURITY_GROUP_OUTPUTS_PATH,
    albSGOutputsContent,
    options.projectName
  );
};

export default applyAwsAlb;
export {
  albVariablesContent,
  albModuleContent,
  albOutputsContent,
  albSGMainContent,
  albSGOutputsContent,
};
