import { dedent } from 'ts-dedent';

import { AwsOptions } from '@/generators/addons/aws';
import { isAwsModuleAdded } from '@/generators/addons/aws/dependencies';
import {
  INFRA_CORE_MAIN_PATH,
  INFRA_CORE_VARIABLES_PATH,
  INFRA_CORE_OUTPUTS_PATH,
  INFRA_CORE_LOCALS_PATH,
} from '@/generators/terraform/constants';
import { appendToFile, copy } from '@/helpers/file';

import { AWS_TEMPLATE_PATH } from '../constants';

const cloudtrailLocalesContent = dedent`
  ### Begin CloudTrail ###
  locals {
    cloudtrail_s3_bucket_policy = {
      Version = "2012-10-17"
      Statement = [
        {
          Sid    = "AWSCloudTrailAclCheck"
          Effect = "Allow"
          Principal = {
            Service = "cloudtrail.amazonaws.com"
          }
          Action = [
            "s3:GetBucketAcl",
            "s3:ListBucket"
          ]
          Resource = "arn:aws:s3:::\${module.cloudtrail_s3_bucket.aws_s3_bucket_name}"
          Condition = {
            StringEquals = {
              "aws:SourceAccount" = data.aws_caller_identity.current.account_id
            }
            ArnLike = {
              "aws:SourceArn" = "arn:aws:cloudtrail:\${data.aws_region.current.region}:\${data.aws_caller_identity.current.account_id}:*"
            }
          }
        },
        {
          Sid    = "AWSCloudTrailWrite"
          Effect = "Allow"
          Principal = {
            Service = "cloudtrail.amazonaws.com"
          }
          Action   = "s3:PutObject"
          Resource = "arn:aws:s3:::\${module.cloudtrail_s3_bucket.aws_s3_bucket_name}/cloudtrail/*"
          Condition = {
            StringEquals = {
              "aws:SourceAccount" = data.aws_caller_identity.current.account_id
              "s3:x-amz-acl"      = "bucket-owner-full-control"
            }
            ArnLike = {
              "aws:SourceArn" = "arn:aws:cloudtrail:\${data.aws_region.current.region}:\${data.aws_caller_identity.current.account_id}:*"
            }
          }
        }
      ]
    }
  }
  ### End CloudTrail ###`;

const cloudtrailVariablesContent = dedent`
  variable "cloudtrail_log_retention_days" {
    description = "The number of days to retain CloudTrail logs in CloudWatch"
    type        = number
    default     = 30
  }`;

const cloudtrailModuleContent = dedent`
  module "cloudtrail_s3_bucket" {
    source = "../modules/s3"

    env_namespace      = local.env_namespace
    bucket_name        = "\${local.env_namespace}-cloudtrail-logs-\${data.aws_caller_identity.current.account_id}"
    force_destroy      = true
    object_ownership   = "BucketOwnerPreferred"
    versioning_enabled = true
    lifecycle_configuration = {
      id     = "log-expiration"
      status = "Enabled"
      filter = {
        prefix = ""
      }
      expiration = {
        days = var.cloudtrail_log_retention_days
      }
    }
  }

  module "cloudtrail_s3_bucket_policy" {
    source = "../modules/s3/bucket_policy"

    s3_bucket_name = module.cloudtrail_s3_bucket.aws_s3_bucket_name
    s3_bucket_policy = local.cloudtrail_s3_bucket_policy
  }

  module "cloudtrail_cloudwatch" {
    source = "../modules/cloudwatch"

    cloud_watch_name      = "/aws/cloudtrail/\${local.env_namespace}-cloudtrail"
    log_retention_in_days = var.cloudtrail_log_retention_days
  }

  module "cloudtrail" {
    source = "../modules/cloudtrail"

    env_namespace              = local.env_namespace
    trail_name                 = "\${local.env_namespace}-cloudtrail"
    s3_bucket_name             = module.cloudtrail_s3_bucket.aws_s3_bucket_name
    s3_key_prefix              = "cloudtrail"
    log_retention_days         = var.cloudtrail_log_retention_days
    s3_ignore_data_bucket_arns = ["arn:aws:s3:::\${module.cloudtrail_s3_bucket.aws_s3_bucket_name}"]
    cloud_watch_arn            = module.cloudtrail_cloudwatch.aws_cloudwatch_log_group_arn
  }`;

const cloudtrailOutputsContent = dedent`
  output "cloudtrail_arn" {
    description = "The ARN of the CloudTrail"
    value       = module.cloudtrail.cloudtrail_arn
  }`;

const applyAwsCloudtrail = async (options: AwsOptions) => {
  if (isAwsModuleAdded('cloudtrail', options.projectName)) {
    return;
  }

  copy(
    `${AWS_TEMPLATE_PATH}/modules/cloudtrail`,
    'modules/cloudtrail',
    options.projectName
  );
  appendToFile(
    INFRA_CORE_LOCALS_PATH,
    cloudtrailLocalesContent,
    options.projectName
  );
  appendToFile(
    INFRA_CORE_VARIABLES_PATH,
    cloudtrailVariablesContent,
    options.projectName
  );
  appendToFile(
    INFRA_CORE_MAIN_PATH,
    cloudtrailModuleContent,
    options.projectName
  );
  appendToFile(
    INFRA_CORE_OUTPUTS_PATH,
    cloudtrailOutputsContent,
    options.projectName
  );
};

export default applyAwsCloudtrail;
export {
  cloudtrailVariablesContent,
  cloudtrailModuleContent,
  cloudtrailOutputsContent,
};
