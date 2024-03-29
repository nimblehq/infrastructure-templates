import { dedent } from 'ts-dedent';

import { AwsOptions } from '@/generators/addons/aws';
import { isAwsModuleAdded } from '@/generators/addons/aws/dependencies';
import {
  INFRA_CORE_MAIN_PATH,
  INFRA_CORE_OUTPUTS_PATH,
} from '@/generators/terraform/constants';
import { appendToFile, copy } from '@/helpers/file';

import { AWS_TEMPLATE_PATH } from '../constants';

const s3OutputsContent = dedent`
  output "s3_alb_log_bucket_name" {
    description = "S3 bucket name for ALB log"
    value       = module.s3.aws_alb_log_bucket_name
  }`;

const s3ModuleContent = dedent`
  module "s3" {
    source = "../modules/s3"

    env_namespace = local.env_namespace
  }`;

const applyAwsS3 = async (options: AwsOptions) => {
  if (isAwsModuleAdded('s3', options.projectName)) {
    return;
  }

  copy(`${AWS_TEMPLATE_PATH}/modules/s3`, 'modules/s3', options.projectName);
  appendToFile(INFRA_CORE_OUTPUTS_PATH, s3OutputsContent, options.projectName);
  appendToFile(INFRA_CORE_MAIN_PATH, s3ModuleContent, options.projectName);
};

export default applyAwsS3;
export { s3ModuleContent, s3OutputsContent };
