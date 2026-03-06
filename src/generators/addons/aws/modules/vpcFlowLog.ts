import { dedent } from 'ts-dedent';

import { AwsOptions } from '@/generators/addons/aws';
import {
  isAwsModuleAdded,
  requireAwsModules,
} from '@/generators/addons/aws/dependencies';
import {
  INFRA_CORE_LOCALS_PATH,
  INFRA_CORE_MAIN_PATH,
  INFRA_CORE_VARIABLES_PATH,
} from '@/generators/terraform/constants';
import { appendToFile, copy } from '@/helpers/file';

import { AWS_TEMPLATE_PATH } from '../constants';

const vpcFlowLogLocalsContent = dedent`
  ### Begin VPC Flow Log ###
  locals {
    vpc_flow_log_s3_bucket_policy = {
      Version = "2012-10-17"
      Statement = [
        {
          Sid    = "AWSLogDeliveryWrite"
          Effect = "Allow"
          Principal = {
            Service = "delivery.logs.amazonaws.com"
          }
          Action   = "s3:PutObject"
          Resource = "arn:aws:s3:::\${module.s3_flow_log.aws_s3_bucket_name}/*"
          Condition = {
            StringEquals = {
              "aws:SourceAccount" = data.aws_caller_identity.current.account_id
              "s3:x-amz-acl"      = "bucket-owner-full-control"
            }
            ArnLike = {
              "aws:SourceArn" = "arn:aws:logs:\${data.aws_region.current.region}:\${data.aws_caller_identity.current.account_id}:*"
            }
          }
        },
        {
          Sid    = "AWSLogDeliveryAclCheck"
          Effect = "Allow"
          Principal = {
            Service = "delivery.logs.amazonaws.com"
          }
          Action = [
            "s3:GetBucketAcl",
            "s3:ListBucket"
          ]
          Resource = "arn:aws:s3:::\${module.s3_flow_log.aws_s3_bucket_name}"
          Condition = {
            StringEquals = {
              "aws:SourceAccount" = data.aws_caller_identity.current.account_id
            }
            ArnLike = {
              "aws:SourceArn" = "arn:aws:logs:\${data.aws_region.current.region}:\${data.aws_caller_identity.current.account_id}:*"
            }
          }
        },
        {
          Effect    = "Deny"
          Principal = "*"
          Action    = "s3:*"
          Resource = [
            "arn:aws:s3:::\${module.s3_flow_log.aws_s3_bucket_name}",
            "arn:aws:s3:::\${module.s3_flow_log.aws_s3_bucket_name}/*"
          ]
          Condition = {
            Bool = {
              "aws:SecureTransport" = "false"
            }
          }
        }
      ]
    }
    vpc_flow_log_query_year_ranges = "\${formatdate("YYYY", timestamp())},\${formatdate("YYYY", timestamp()) + 5}"
  }
  ### End VPC Flow Log ###`;

const vpcFlowLogVariablesContent = dedent`
  variable "vpc_flow_log_retention_days" {
    description = "The number of days to retain VPC Flow Logs in S3"
    type        = number
    default     = 30
  }`;

const vpcFlowLogModuleContent = dedent`
  module "s3_flow_log" {
    source = "../modules/s3"

    env_namespace    = local.env_namespace
    bucket_name      = "\${local.env_namespace}-flow-logs-\${data.aws_caller_identity.current.account_id}"
    force_destroy    = false
    object_ownership = "BucketOwnerPreferred"
  }

  module "s3_flow_log_policy" {
    source = "../modules/s3/bucket_policy"

    s3_bucket_name = module.s3_flow_log.aws_s3_bucket_name
    s3_bucket_policy = local.vpc_flow_log_s3_bucket_policy
  }

  module "vpc_flow_log" {
    source = "../modules/vpc_flow_log"

    env_namespace      = local.env_namespace
    vpc_id             = module.vpc.vpc_id
    s3_bucket_name     = module.s3_flow_log.aws_s3_bucket_name
    log_retention_days = var.vpc_flow_log_retention_days
    query_year_ranges  = local.vpc_flow_log_query_year_ranges
  }`;

const applyAwsVpcFlowLog = async (options: AwsOptions) => {
  if (isAwsModuleAdded('vpcFlowLog', options.projectName)) {
    return;
  }
  await requireAwsModules('vpcFlowLog', 'vpc', options);

  copy(
    `${AWS_TEMPLATE_PATH}/modules/vpc_flow_log`,
    'modules/vpc_flow_log',
    options.projectName
  );
  appendToFile(
    INFRA_CORE_LOCALS_PATH,
    vpcFlowLogLocalsContent,
    options.projectName
  );
  appendToFile(
    INFRA_CORE_VARIABLES_PATH,
    vpcFlowLogVariablesContent,
    options.projectName
  );
  appendToFile(
    INFRA_CORE_MAIN_PATH,
    vpcFlowLogModuleContent,
    options.projectName
  );
};

export default applyAwsVpcFlowLog;
export { vpcFlowLogModuleContent, vpcFlowLogVariablesContent };
