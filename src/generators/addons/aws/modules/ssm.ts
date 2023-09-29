import { dedent } from 'ts-dedent';

import { AwsOptions } from '@/generators/addons/aws';
import {
  isAwsModuleAdded,
  requireAwsModules,
} from '@/generators/addons/aws/dependencies';
import {
  INFRA_CORE_MAIN_PATH,
  INFRA_CORE_VARIABLES_PATH,
} from '@/generators/terraform/constants';
import { appendToFile, copy } from '@/helpers/file';

import { AWS_TEMPLATE_PATH } from '../constants';

const ssmVariablesContent = dedent`
  variable "secret_key_base" {
    description = "The Secret key base for the application"
    type = string
  }`;

const ssmModuleContent = dedent`
  module "ssm" {
    source = "../modules/ssm"

    env_namespace = local.env_namespace

    secrets = {
      database_url = "postgres://\${var.rds_username}:\${var.rds_password}@\${module.rds.db_endpoint}/\${var.rds_database_name}"
      secret_key_base = var.secret_key_base
    }
  }`;

const applyAwsSsm = async (options: AwsOptions) => {
  if (isAwsModuleAdded('ssm', options.projectName)) {
    return;
  }
  await requireAwsModules('ssm', 'ecs', options);

  copy(`${AWS_TEMPLATE_PATH}/modules/ssm`, 'modules/ssm', options.projectName);
  appendToFile(
    INFRA_CORE_VARIABLES_PATH,
    ssmVariablesContent,
    options.projectName
  );
  appendToFile(INFRA_CORE_MAIN_PATH, ssmModuleContent, options.projectName);
};

export default applyAwsSsm;
export { ssmVariablesContent, ssmModuleContent };
