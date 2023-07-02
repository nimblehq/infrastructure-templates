import { dedent } from 'ts-dedent';

import { appendToFile, copy } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import {
  INFRA_BASE_MAIN_PATH,
  INFRA_BASE_VARIABLES_PATH,
} from '@/templates/core/constants';
import {
  isAwsModuleAdded,
  requireAwsModules,
} from '@/templates/core/dependencies';

import {
  AWS_SECURITY_GROUP_MAIN_PATH,
  AWS_SECURITY_GROUP_OUTPUTS_PATH,
  AWS_SKELETON_PATH,
} from '../constants';

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
  }`;

const rdsModuleContent = dedent`
  module "rds" {
    source = "../modules/rds"

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
  }`;

const rdsSGMainContent = dedent`
  resource "aws_security_group" "rds" {
    name        = "\${var.namespace}-rds"
    description = "RDS Security Group"
    vpc_id      = var.vpc_id

    tags = {
      Name = "\${var.namespace}-rds-sg"
    }
  }

  resource "aws_security_group_rule" "rds_ingress_app_fargate" {
    type                     = "ingress"
    security_group_id        = aws_security_group.rds.id
    from_port                = 5432
    to_port                  = 5432
    protocol                 = "tcp"
    source_security_group_id = aws_security_group.ecs_fargate.id
    description              = "From app to DB"
  }

  resource "aws_security_group_rule" "rds_ingress_bastion" {
    type                     = "ingress"
    security_group_id        = aws_security_group.rds.id
    from_port                = 5432
    to_port                  = 5432
    protocol                 = "tcp"
    source_security_group_id = aws_security_group.bastion.id
    description              = "From bastion to RDS"
  }`;

const rdsSGOutputsContent = dedent`
  output "rds_security_group_ids" {
    description = "Security group IDs for Aurora"
    value       = [aws_security_group.rds.id]
  }`;

const applyAwsRds = async (options: AwsOptions) => {
  if (isAwsModuleAdded('rds', options.projectName)) {
    return;
  }
  await requireAwsModules('rds', 'securityGroup', options);

  copy(`${AWS_SKELETON_PATH}/modules/rds`, 'modules/rds', options.projectName);
  appendToFile(
    INFRA_BASE_VARIABLES_PATH,
    rdsVariablesContent,
    options.projectName
  );
  appendToFile(INFRA_BASE_MAIN_PATH, rdsModuleContent, options.projectName);
  appendToFile(
    AWS_SECURITY_GROUP_MAIN_PATH,
    rdsSGMainContent,
    options.projectName
  );
  appendToFile(
    AWS_SECURITY_GROUP_OUTPUTS_PATH,
    rdsSGOutputsContent,
    options.projectName
  );
};

export default applyAwsRds;
export {
  rdsVariablesContent,
  rdsModuleContent,
  rdsSGMainContent,
  rdsSGOutputsContent,
};
