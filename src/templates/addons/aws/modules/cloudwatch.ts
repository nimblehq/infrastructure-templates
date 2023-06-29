import { dedent } from 'ts-dedent';

import { appendToFile, copy } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import {
  INFRA_BASE_MAIN_PATH,
  INFRA_BASE_VARIABLES_PATH,
} from '@/templates/core/constants';
import { isAWSModuleAdded } from '@/templates/core/dependencies';

const cloudwatchVariablesContent = dedent`
  variable "cloudwatch_log_retention_in_days" {
    description = "How long (days) to retain the cloudwatch log data"
    default     = 365
  }`;

const cloudwatchModuleContent = dedent`
  module "cloudwatch" {
    source = "../modules/cloudwatch"

    namespace = var.namespace

    log_retention_in_days = var.cloudwatch_log_retention_in_days
  }`;

const applyCloudwatch = async (options: AwsOptions) => {
  if (isAWSModuleAdded('cloudwatch', options.projectName)) {
    return;
  }

  copy('aws/modules/cloudwatch', 'modules/cloudwatch', options.projectName);
  appendToFile(
    INFRA_BASE_VARIABLES_PATH,
    cloudwatchVariablesContent,
    options.projectName
  );
  appendToFile(
    INFRA_BASE_MAIN_PATH,
    cloudwatchModuleContent,
    options.projectName
  );
};

export default applyCloudwatch;
export { cloudwatchVariablesContent, cloudwatchModuleContent };
