import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';

const applySsm = ({ projectName }: AwsOptions) => {
  const ssmVariablesContent = dedent`
    variable "secret_key_base" {
      description = "The Secret key base for the application"
      type = string
    }
  \n`;
  const ssmModuleContent = dedent`
    module "ssm" {
      source = "./modules/ssm"

      namespace = var.namespace
      secret_key_base       = var.secret_key_base

      rds_username      = var.rds_username
      rds_password      = var.rds_password
      rds_database_name = var.rds_database_name
      rds_endpoint      = module.rds.db_endpoint
    }
  \n`;

  copy('aws/modules/ssm', 'modules/ssm', projectName);
  appendToFile('variables.tf', ssmVariablesContent, projectName);
  appendToFile('main.tf', ssmModuleContent, projectName);
};

export default applySsm;
