import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';

const applyBastion = ({ projectName }: AwsOptions) => {
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
    }
  \n`;
  const bastionModuleContent = dedent`
    module "bastion" {
      source = "./modules/bastion"

      subnet_ids                  = module.vpc.public_subnet_ids
      instance_security_group_ids = module.security_group.bastion_security_group_ids

      namespace     = var.namespace
      image_id      = var.bastion_image_id
      instance_type = var.bastion_instance_type

      min_instance_count     = var.bastion_min_instance_count
      max_instance_count     = var.bastion_max_instance_count
      instance_desired_count = var.bastion_instance_desired_count
    }
  \n`;

  copy('aws/modules/bastion', 'modules/bastion', projectName);
  appendToFile('variables.tf', bastionVariablesContent, projectName);
  appendToFile('main.tf', bastionModuleContent, projectName);
};

export default applyBastion;
