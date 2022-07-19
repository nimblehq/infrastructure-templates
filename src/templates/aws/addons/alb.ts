import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copyDir } from '../../../helpers/file';

const applyAlb = ({ projectName }: AwsOptions) => {
  const albVariablesContent = dedent`
    variable "health_check_path" {
      description = "Application health check path"
      type = string
    }

    variable "domain" {
      description = "Application domain"
      type        = string
    }
  \n`;
  const albModuleContent = dedent`
    module "alb" {
      source = "./modules/alb"

      vpc_id             = module.vpc.vpc_id
      namespace          = var.namespace
      app_port           = var.app_port
      subnet_ids         = module.vpc.public_subnet_ids
      security_group_ids = module.security_group.alb_security_group_ids
      health_check_path  = var.health_check_path
    }
  \n`;
  const vpcOutputContent = dedent`
    output "alb_dns_name" {
      description = "ALB DNS"
      value       = module.alb.alb_dns_name
    }
  \n`;

  copyDir('aws/modules/alb', 'modules/alb', projectName);
  appendToFile('main.tf', albModuleContent, projectName);
  appendToFile('variables.tf', albVariablesContent, projectName);
  appendToFile('outputs.tf', vpcOutputContent, projectName);
};

export default applyAlb;
