import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';

const ssmVariablesContent = dedent`
  variable "secret_key_base" {
    description = "The Secret key base for the application"
    type = string
  }
\n`;
/* eslint-disable no-template-curly-in-string */
const databaseUrlString =
  'postgres://${var.rds_username}:${var.rds_password}@${module.rds.db_endpoint}/${var.rds_database_name}';
/* eslint-enable no-template-curly-in-string */
const ssmModuleContent = dedent`
  module "ssm" {
    source = "./modules/ssm"

    namespace = var.namespace

    secrets = {
      database_url = "${databaseUrlString}"
      secret_key_base = var.secret_key_base
    }
  }
\n`;

const applySsm = ({ projectName }: AwsOptions) => {
  copy('aws/modules/ssm', 'modules/ssm', projectName);
  appendToFile('variables.tf', ssmVariablesContent, projectName);
  appendToFile('main.tf', ssmModuleContent, projectName);
};

export default applySsm;
export { ssmVariablesContent, ssmModuleContent };
