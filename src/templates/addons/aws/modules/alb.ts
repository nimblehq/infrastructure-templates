import { dedent } from 'ts-dedent';

import { appendToFile, copy } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import {
  isAwsModuleAdded,
  requireAwsModules,
} from '@/templates/addons/aws/dependencies';
import {
  INFRA_BASE_MAIN_PATH,
  INFRA_BASE_OUTPUTS_PATH,
  INFRA_BASE_VARIABLES_PATH,
} from '@/templates/core/constants';

import {
  AWS_SECURITY_GROUP_MAIN_PATH,
  AWS_SECURITY_GROUP_OUTPUTS_PATH,
  AWS_SKELETON_PATH,
} from '../constants';

const albVariablesContent = dedent`
  variable "health_check_path" {
    description = "Application health check path"
    type = string
  }

  variable "domain" {
    description = "Application domain"
    type        = string
  }`;

const albModuleContent = dedent`
  module "alb" {
    source = "../modules/alb"

    vpc_id             = module.vpc.vpc_id
    namespace          = var.namespace
    app_port           = var.app_port
    subnet_ids         = module.vpc.public_subnet_ids
    security_group_ids = module.security_group.alb_security_group_ids
    health_check_path  = var.health_check_path
  }`;

const albOutputsContent = dedent`
  output "alb_dns_name" {
    description = "ALB DNS"
    value       = module.alb.alb_dns_name
  }`;

const albSGMainContent = dedent`
  resource "aws_security_group" "alb" {
    name        = "\${var.namespace}-alb-sg"
    description = "ALB Security Group"
    vpc_id      = var.vpc_id

    tags = {
      Name = "\${var.namespace}-alb-sg"
    }
  }

  # tfsec:ignore:aws-ec2-no-public-ingress-sgr
  resource "aws_security_group_rule" "alb_ingress_https" {
    type              = "ingress"
    security_group_id = aws_security_group.alb.id
    protocol          = "tcp"
    from_port         = 443
    to_port           = 443
    cidr_blocks       = ["0.0.0.0/0"]
    description       = "From HTTPS to ALB"
  }

  # tfsec:ignore:aws-ec2-no-public-ingress-sgr
  resource "aws_security_group_rule" "alb_ingress_http" {
    type              = "ingress"
    security_group_id = aws_security_group.alb.id
    protocol          = "tcp"
    from_port         = 80
    to_port           = 80
    cidr_blocks       = ["0.0.0.0/0"]
    description       = "From HTTP to ALB"
  }

  # tfsec:ignore:aws-ec2-no-public-egress-sgr
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

  copy(`${AWS_SKELETON_PATH}/modules/alb`, 'modules/alb', options.projectName);
  appendToFile(INFRA_BASE_MAIN_PATH, albModuleContent, options.projectName);
  appendToFile(
    INFRA_BASE_VARIABLES_PATH,
    albVariablesContent,
    options.projectName
  );
  appendToFile(INFRA_BASE_OUTPUTS_PATH, albOutputsContent, options.projectName);
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
