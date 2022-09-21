import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';

const albVariablesContent = dedent`
    variable "health_check_path" {
      description = "Application health check path"
      type = string
    }

    variable "domain" {
      description = "Application domain"
      type        = string
    }

    variable "enable_alb_stickiness" {
      description = "Enable sticky sessions for ALB"
      type        = bool
      default     = false
    }

    variable "alb_stickiness_type" {
      description = "ALB stickiness type"
      type        = string
      default     = "lb_cookie"
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
      enable_stickiness  = var.enable_alb_stickiness
      stickiness_type    = var.alb_stickiness_type
    }
  \n`;
const albOutputsContent = dedent`
    output "alb_dns_name" {
      description = "ALB DNS"
      value       = module.alb.alb_dns_name
    }
  \n`;

const applyAlb = ({ projectName }: AwsOptions) => {
  copy('aws/modules/alb', 'modules/alb', projectName);
  appendToFile('main.tf', albModuleContent, projectName);
  appendToFile('variables.tf', albVariablesContent, projectName);
  appendToFile('outputs.tf', albOutputsContent, projectName);
};

export default applyAlb;
export { albVariablesContent, albModuleContent, albOutputsContent };
