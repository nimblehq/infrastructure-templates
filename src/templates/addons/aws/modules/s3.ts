import { dedent } from 'ts-dedent';

import { appendToFile, copy } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import {
  INFRA_BASE_MAIN_PATH,
  INFRA_BASE_OUTPUTS_PATH,
} from '@/templates/core/constants';
import { isAWSModuleAdded } from '@/templates/core/dependencies';

const s3OutputsContent = dedent`
  output "s3_alb_log_bucket_name" {
    description = "S3 bucket name for ALB log"
    value       = module.s3.aws_alb_log_bucket_name
  }`;

const s3ModuleContent = dedent`
  module "s3" {
    source = "../modules/s3"

    namespace   = var.namespace
  }`;

const applyS3 = async (options: AwsOptions) => {
  if (isAWSModuleAdded('s3', options.projectName)) {
    return;
  }

  copy('aws/modules/s3', 'modules/s3', options.projectName);
  appendToFile(INFRA_BASE_OUTPUTS_PATH, s3OutputsContent, options.projectName);
  appendToFile(INFRA_BASE_MAIN_PATH, s3ModuleContent, options.projectName);
};

export default applyS3;
export { s3ModuleContent, s3OutputsContent };
