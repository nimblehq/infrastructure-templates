import { dedent } from 'ts-dedent';

import { AwsOptions } from '@/generators/addons/aws';
import {
  isAwsModuleAdded,
  requireAwsModules,
} from '@/generators/addons/aws/dependencies';
import {
  INFRA_CORE_MAIN_PATH,
  INFRA_CORE_VARIABLES_PATH,
} from '@/generators/terraform/constants';
import { appendToFile, copy } from '@/helpers/file';

import {
  AWS_SECURITY_GROUP_MAIN_PATH,
  AWS_SECURITY_GROUP_OUTPUTS_PATH,
  AWS_TEMPLATE_PATH,
} from '../constants';

const ecsVariablesContent = dedent`
  variable "ecr_repo_name" {
    description = "ECR repo name"
    type = string
  }

  variable "ecr_tag" {
    description = "ECR tag to deploy"
    type     = string
  }

  variable "ecs_config" {
    description = "ECS input variables"
    type = object({
      task_cpu                           = number
      task_memory                        = number
      task_desired_count                 = number
      task_container_memory              = number
      deployment_maximum_percent         = number
      deployment_minimum_healthy_percent = number

      # Auto-scaling
      min_instance_count                   = number
      max_instance_count                   = number
      autoscaling_target_cpu_percentage    = number
      autoscaling_target_memory_percentage = number
    })
  }

  variable "environment_variables" {
    description = "List of [{name = \\"\\", value = \\"\\"}] pairs of environment variables"
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
  }`;

const ecsModuleContent = dedent`
  module "ecs" {
    source = "../modules/ecs"

    subnets                            = module.vpc.private_subnet_ids
    env_namespace                      = local.env_namespace
    region                             = var.region
    app_host                           = module.alb.alb_dns_name
    app_port                           = var.app_port
    ecr_repo_name                      = var.ecr_repo_name
    ecr_tag                            = var.ecr_tag
    security_groups                    = module.security_group.ecs_security_group_ids
    alb_target_group_arn               = module.alb.alb_target_group_arn
    aws_cloudwatch_log_group_name      = module.cloudwatch.aws_cloudwatch_log_group_name
    desired_count                      = var.ecs_config.task_desired_count
    cpu                                = var.ecs_config.task_cpu
    memory                             = var.ecs_config.task_memory
    deployment_maximum_percent         = var.ecs_config.deployment_maximum_percent
    deployment_minimum_healthy_percent = var.ecs_config.deployment_minimum_healthy_percent
    container_memory                   = var.ecs_config.task_container_memory

    # Auto-scaling
    min_instance_count                   = var.ecs_config.min_instance_count
    max_instance_count                   = var.ecs_config.max_instance_count
    autoscaling_target_cpu_percentage    = var.ecs_config.autoscaling_target_cpu_percentage
    autoscaling_target_memory_percentage = var.ecs_config.autoscaling_target_memory_percentage

    environment_variables = var.environment_variables
    secrets_variables     = module.ssm.secrets_variables
    secrets_arns          = module.ssm.parameter_store_arns
  }`;

const ecsSGMainContent = dedent`
  resource "aws_security_group" "ecs_fargate" {
    name        = "\${var.env_namespace}-ecs-fargate-sg"
    description = "ECS Fargate Security Group"
    vpc_id      = var.vpc_id

    tags = {
      Name = "\${var.env_namespace}-ecs-fargate-sg"
    }
  }

  resource "aws_security_group_rule" "ecs_fargate_ingress_alb" {
    type                     = "ingress"
    security_group_id        = aws_security_group.ecs_fargate.id
    protocol                 = "tcp"
    from_port                = var.app_port
    to_port                  = var.app_port
    source_security_group_id = aws_security_group.alb.id
    description              = "From internal VPC to app"
  }

  resource "aws_security_group_rule" "ecs_fargate_ingress_private" {
    type              = "ingress"
    security_group_id = aws_security_group.ecs_fargate.id
    protocol          = "-1"
    from_port         = 0
    to_port           = 65535
    cidr_blocks       = var.private_subnets_cidr_blocks
    description       = "From internal VPC to app"
  }

  # tfsec:ignore:aws-ec2-no-public-egress-sgr
  resource "aws_security_group_rule" "ecs_fargate_egress_anywhere" {
    type              = "egress"
    security_group_id = aws_security_group.ecs_fargate.id
    protocol          = "-1"
    from_port         = 0
    to_port           = 0
    cidr_blocks       = ["0.0.0.0/0"]
    description       = "From app to everywhere"
  }`;

const ecsSGOutputsContent = dedent`
  output "ecs_security_group_ids" {
    description = "Security group IDs for ECS Fargate"
    value       = [aws_security_group.ecs_fargate.id]
  }`;

const applyAwsEcs = async (options: AwsOptions) => {
  if (isAwsModuleAdded('ecs', options.projectName)) {
    return;
  }
  await requireAwsModules('ecs', 'securityGroup', options);

  copy(`${AWS_TEMPLATE_PATH}/modules/ecs`, 'modules/ecs', options.projectName);
  appendToFile(
    INFRA_CORE_VARIABLES_PATH,
    ecsVariablesContent,
    options.projectName
  );
  appendToFile(INFRA_CORE_MAIN_PATH, ecsModuleContent, options.projectName);
  appendToFile(
    AWS_SECURITY_GROUP_MAIN_PATH,
    ecsSGMainContent,
    options.projectName
  );
  appendToFile(
    AWS_SECURITY_GROUP_OUTPUTS_PATH,
    ecsSGOutputsContent,
    options.projectName
  );
};

export default applyAwsEcs;
export {
  ecsVariablesContent,
  ecsModuleContent,
  ecsSGMainContent,
  ecsSGOutputsContent,
};
