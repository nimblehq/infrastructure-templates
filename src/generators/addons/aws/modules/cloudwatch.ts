import { dedent } from 'ts-dedent';

import { AwsOptions } from '@/generators/addons/aws';
import { isAwsModuleAdded } from '@/generators/addons/aws/dependencies';
import {
  INFRA_CORE_MAIN_PATH,
  INFRA_CORE_VARIABLES_PATH,
} from '@/generators/terraform/constants';
import { appendToFile, copy } from '@/helpers/file';

import { AWS_TEMPLATE_PATH } from '../constants';

const cloudwatchVariablesContent = dedent`
  variable "cloudwatch_log_retention_in_days" {
    description = "How long (days) to retain the cloudwatch log data"
    default     = 365
  }`;

const cloudwatchModuleContent = dedent`
  module "cloudwatch" {
    source = "../modules/cloudwatch"

    env_namespace = local.env_namespace

    log_retention_in_days = var.cloudwatch_log_retention_in_days
  }`;

const applyAwsCloudwatch = async (options: AwsOptions) => {
  if (isAwsModuleAdded('cloudwatch', options.projectName)) {
    return;
  }

  copy(
    `${AWS_TEMPLATE_PATH}/modules/cloudwatch`,
    'modules/cloudwatch',
    options.projectName
  );
  appendToFile(
    INFRA_CORE_VARIABLES_PATH,
    cloudwatchVariablesContent,
    options.projectName
  );
  appendToFile(
    INFRA_CORE_MAIN_PATH,
    cloudwatchModuleContent,
    options.projectName
  );
};

export default applyAwsCloudwatch;
export { cloudwatchVariablesContent, cloudwatchModuleContent };
