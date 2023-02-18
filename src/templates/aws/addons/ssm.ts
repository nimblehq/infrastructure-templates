import { dedent } from 'ts-dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';
import {
  INFRA_BASE_MAIN_PATH,
  INFRA_BASE_VARIABLES_PATH,
} from '../../core/constants';

const ssmVariablesContent = dedent`
  variable "secret_key_base" {
    description = "The Secret key base for the application"
    type = string
  }`;
/* eslint-disable no-template-curly-in-string */
const databaseUrlString =
  'postgres://${var.rds_username}:${var.rds_password}@${module.rds.db_endpoint}/${var.rds_database_name}';
/* eslint-enable no-template-curly-in-string */
const ssmModuleContent = dedent`
  module "ssm" {
    source = "../modules/ssm"

    namespace = var.namespace

    secrets = {
      database_url = "${databaseUrlString}"
      secret_key_base = var.secret_key_base
    }
  }`;

const applySsm = ({ projectName }: AwsOptions) => {
  copy('aws/modules/ssm', 'modules/ssm', projectName);
  appendToFile(INFRA_BASE_VARIABLES_PATH, ssmVariablesContent, projectName);
  appendToFile(INFRA_BASE_MAIN_PATH, ssmModuleContent, projectName);
};

export default applySsm;
export { ssmVariablesContent, ssmModuleContent };
