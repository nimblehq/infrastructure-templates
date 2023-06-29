import { dedent } from 'ts-dedent';

import { appendToFile, copy } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import {
  INFRA_BASE_MAIN_PATH,
  INFRA_BASE_VARIABLES_PATH,
} from '@/templates/core/constants';
import {
  isAWSModuleAdded,
  requireAWSModules,
} from '@/templates/core/dependencies';

import { AWS_SKELETON_PATH } from '../constants';

const ssmVariablesContent = dedent`
  variable "secret_key_base" {
    description = "The Secret key base for the application"
    type = string
  }`;

const ssmModuleContent = dedent`
  module "ssm" {
    source = "../modules/ssm"

    namespace = var.namespace

    secrets = {
      database_url = "postgres://\${var.rds_username}:\${var.rds_password}@\${module.rds.db_endpoint}/\${var.rds_database_name}"
      secret_key_base = var.secret_key_base
    }
  }`;

const applySsm = async (options: AwsOptions) => {
  if (isAWSModuleAdded('ssm', options.projectName)) {
    return;
  }
  await requireAWSModules('ssm', 'ecs', options);

  copy(`${AWS_SKELETON_PATH}/modules/ssm`, 'modules/ssm', options.projectName);
  appendToFile(
    INFRA_BASE_VARIABLES_PATH,
    ssmVariablesContent,
    options.projectName
  );
  appendToFile(INFRA_BASE_MAIN_PATH, ssmModuleContent, options.projectName);
};

export default applySsm;
export { ssmVariablesContent, ssmModuleContent };