import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';

const rdsVariablesContent = dedent`
  variable "rds_instance_type" {
    description = "The RDB instance type"
    type        = string
  }

  variable "rds_database_name" {
    description = "RDS database name"
    type = string
  }

  variable "rds_username" {
    description = "RDS username"
    type = string
  }

  variable "rds_password" {
    description = "RDS password"
    type = string
  }

  variable "rds_autoscaling_min_capacity" {
    description = "Minimum number of RDS read replicas when autoscaling is enabled"
    type = number
  }

  variable "rds_autoscaling_max_capacity" {
    description = "Maximum number of RDS read replicas when autoscaling is enabled"
    type = number
  }
\n`;
const rdsModuleContent = dedent`
  module "rds" {
    source = "./modules/rds"

    namespace = var.namespace

    vpc_security_group_ids = module.security_group.rds_security_group_ids
    vpc_id                 = module.vpc.vpc_id

    subnet_ids = module.vpc.private_subnet_ids

    instance_type = var.rds_instance_type
    database_name = var.rds_database_name
    username      = var.rds_username
    password      = var.rds_password

    autoscaling_min_capacity = var.rds_autoscaling_min_capacity
    autoscaling_max_capacity = var.rds_autoscaling_max_capacity
  }
\n`;

const applyRds = ({ projectName }: AwsOptions) => {
  copy('aws/modules/rds', 'modules/rds', projectName);
  appendToFile('variables.tf', rdsVariablesContent, projectName);
  appendToFile('main.tf', rdsModuleContent, projectName);
};

export default applyRds;
export { rdsVariablesContent, rdsModuleContent };
