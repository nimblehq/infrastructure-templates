import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';

const applyEcs = ({ projectName }: AwsOptions) => {
  const bastionVariablesContent = dedent`
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

      aws_parameter_store = module.ssm.parameter_store
    }
  \n`;

  copy('aws/modules/ecs', 'modules/ecs', projectName);
  appendToFile('variables.tf', bastionVariablesContent, projectName);
  appendToFile('main.tf', ecsModuleContent, projectName);
};

export default applyEcs;
