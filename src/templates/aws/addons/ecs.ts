import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';

const ecsVariablesContent = dedent`
  variable "ecr_repo_name" {
    description = "ECR repo name"
    type = string
  }

  variable "ecr_tag" {
    description = "ECR tag to deploy"
    type     = string
  }

  variable "ecs" {
    description = "ECS input variables"
    type = object({
      task_cpu                           = number
      task_memory                        = number
      task_desired_count                 = number
      task_container_memory              = number
      deployment_maximum_percent         = number
      deployment_minimum_healthy_percent = number
    })
  }

  variable "environment_variables" {
    description = "List of [{name = \"\", value = \"\"}] pairs of environment variables"
    type = set(object({
      name  = string
      value = string
    }))
    default = [
      {
        name  = "AVAILABLE_LOCALES"
        value = "en"
      },
      {
        name  = "DEFAULT_LOCALE"
        value = "en"
      },
      {
        name  = "FALLBACK_LOCALES"
        value = "en"
      },
      {
        name  = "MAILER_DEFAULT_HOST"
        value = "localhost"
      },
      {
        name  = "MAILER_DEFAULT_PORT"
        value = "80"
      },
    ]
  }
\n`;

const ecsModuleContent = dedent`
  module "ecs" {
    source = "./modules/ecs"

    subnets                            = module.vpc.private_subnet_ids
    namespace                          = var.namespace
    region                             = var.region
    app_host                           = module.alb.alb_dns_name
    app_port                           = var.app_port
    ecr_repo_name                      = var.ecr_repo_name
    ecr_tag                            = var.ecr_tag
    security_groups                    = module.security_group.ecs_security_group_ids
    alb_target_group_arn               = module.alb.alb_target_group_arn
    aws_cloudwatch_log_group_name      = module.log.aws_cloudwatch_log_group_name
    desired_count                      = var.ecs.task_desired_count
    cpu                                = var.ecs.task_cpu
    memory                             = var.ecs.task_memory
    deployment_maximum_percent         = var.ecs.deployment_maximum_percent
    deployment_minimum_healthy_percent = var.ecs.deployment_minimum_healthy_percent
    container_memory                   = var.ecs.task_container_memory

    environment_variables = var.environment_variables
    secrets_variables     = module.ssm.secrets_variables
    secrets_arns          = module.ssm.parameter_store_arns
  }
\n`;

const applyEcs = ({ projectName }: AwsOptions) => {
  copy('aws/modules/ecs', 'modules/ecs', projectName);
  appendToFile('variables.tf', ecsVariablesContent, projectName);
  appendToFile('main.tf', ecsModuleContent, projectName);
};

export default applyEcs;
export { ecsVariablesContent, ecsModuleContent };
