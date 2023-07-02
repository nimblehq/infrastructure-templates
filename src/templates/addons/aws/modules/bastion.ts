import { dedent } from 'ts-dedent';

import { appendToFile, copy } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import {
  isAwsModuleAdded,
  requireAwsModules,
} from '@/templates/addons/aws/dependencies';
import {
  INFRA_BASE_MAIN_PATH,
  INFRA_BASE_VARIABLES_PATH,
} from '@/templates/core/constants';

import {
  AWS_SECURITY_GROUP_MAIN_PATH,
  AWS_SECURITY_GROUP_OUTPUTS_PATH,
  AWS_SKELETON_PATH,
} from '../constants';

const bastionVariablesContent = dedent`
  variable "bastion_image_id" {
    description = "The AMI image ID for the bastion instance"
    default = "ami-0801a1e12f4a9ccc0"
  }

  variable "bastion_instance_type" {
    description = "The bastion instance type"
    default = "t3.nano"
  }

  variable "bastion_instance_desired_count" {
    description = "The desired number of the bastion instance"
    default = 1
  }

  variable "bastion_max_instance_count" {
    description = "The maximum number of the instance"
    default = 1
  }

  variable "bastion_min_instance_count" {
    description = "The minimum number of the instance"
    default = 1
  }`;

const bastionModuleContent = dedent`
  module "bastion" {
    source = "../modules/bastion"

    subnet_ids                  = module.vpc.public_subnet_ids
    instance_security_group_ids = module.security_group.bastion_security_group_ids

    namespace     = var.namespace
    image_id      = var.bastion_image_id
    instance_type = var.bastion_instance_type

    min_instance_count     = var.bastion_min_instance_count
    max_instance_count     = var.bastion_max_instance_count
    instance_desired_count = var.bastion_instance_desired_count
  }`;

const bastionSGMainContent = dedent`
  resource "aws_security_group" "bastion" {
    name        = "\${var.namespace}-bastion"
    description = "Bastion Security Group"
    vpc_id      = var.vpc_id

    tags = {
      Name = "\${var.namespace}-bastion-sg"
    }
  }

  resource "aws_security_group_rule" "bastion_ingress_ssh_nimble" {
    type              = "ingress"
    security_group_id = aws_security_group.bastion.id
    from_port         = 22
    to_port           = 22
    protocol          = "tcp"
    cidr_blocks       = ["\${var.nimble_office_ip}/32"]
    description       = "Nimble office"
  }

  resource "aws_security_group_rule" "bastion_egress_rds" {
    type                     = "egress"
    security_group_id        = aws_security_group.bastion.id
    from_port                = 5432
    to_port                  = 5432
    protocol                 = "tcp"
    source_security_group_id = aws_security_group.rds.id
    description              = "From RDS to bastion"
  }`;

const bastionSGOutputsContent = dedent`
  output "bastion_security_group_ids" {
    description = "Security group IDs for Bastion"
    value       = [aws_security_group.bastion.id]
  }`;

const applyAwsBastion = async (options: AwsOptions) => {
  if (isAwsModuleAdded('bastion', options.projectName)) {
    return;
  }
  await requireAwsModules('bastion', 'securityGroup', options);

  copy(
    `${AWS_SKELETON_PATH}/modules/bastion`,
    'modules/bastion',
    options.projectName
  );
  appendToFile(
    INFRA_BASE_VARIABLES_PATH,
    bastionVariablesContent,
    options.projectName
  );
  appendToFile(INFRA_BASE_MAIN_PATH, bastionModuleContent, options.projectName);
  appendToFile(
    AWS_SECURITY_GROUP_MAIN_PATH,
    bastionSGMainContent,
    options.projectName
  );
  appendToFile(
    AWS_SECURITY_GROUP_OUTPUTS_PATH,
    bastionSGOutputsContent,
    options.projectName
  );
};

export default applyAwsBastion;
export {
  bastionVariablesContent,
  bastionModuleContent,
  bastionSGMainContent,
  bastionSGOutputsContent,
};
