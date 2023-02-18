import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';
import {
  INFRA_BASE_MAIN_PATH,
  INFRA_BASE_OUTPUTS_PATH,
} from '../../core/constants';

const s3OutputsContent = dedent`
  output "s3_alb_log_bucket_name" {
    description = "S3 bucket name for ALB log"
    value       = module.s3.aws_alb_log_bucket_name
  }`;

const s3ModuleContent = dedent`
  module "s3" {
    source = "./modules/s3"

    namespace   = var.namespace
  }`;

const applyS3 = ({ projectName }: AwsOptions) => {
  copy('aws/modules/s3', 'modules/s3', projectName);
  appendToFile(INFRA_BASE_OUTPUTS_PATH, s3OutputsContent, projectName);
  appendToFile(INFRA_BASE_MAIN_PATH, s3ModuleContent, projectName);
};

export default applyS3;
export { s3ModuleContent, s3OutputsContent };
