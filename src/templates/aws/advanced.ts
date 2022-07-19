import * as dedent from 'dedent';

import { AwsOptions } from '.';
import {
  appendToFile,
  copyDir,
  copyFile,
  injectToFile,
} from '../../helpers/file';

export default class Advanced {
  options: AwsOptions;

  constructor(options: AwsOptions) {
    this.options = options;
  }

  static run(options: AwsOptions): void {
    const advanced = new Advanced(options);
    advanced.applyTemplate();
  }

  private applyTemplate(): void {
    this.applyCommon();
    this.applyRegion();
    this.applyVpc();
    this.applySecurityGroup();
    this.applyEcr();
    this.applyLog();
    this.applyS3();
    this.applyAlb();
    this.applyRds();
    this.applyBastionInstance();
    this.applySsm();
    this.applyEcs();
  }

  private applyCommon(): void {
    copyFile('aws/main.tf', 'main.tf', this.options.projectName);
    copyFile('aws/outputs.tf', 'outputs.tf', this.options.projectName);
    copyFile('aws/variables.tf', 'variables.tf', this.options.projectName);
  }

  private applyRegion(): void {
    const regionVariableContent = dedent`
    variable "region" {
      description = "AWS region"
      type        = string
      default     = "${this.options.awsRegion}"
    }\n\n`;
    appendToFile('variables.tf', regionVariableContent, this.options.projectName);
  }

  private applyVpc(): void {
    copyDir('aws/modules/vpc', 'modules/vpc', this.options.projectName);

    const vpcOutputContent = dedent`
    output "vpc_id" {
      description = "VPC ID"
      value       = module.vpc.vpc_id
    }\n\n`;
    appendToFile('outputs.tf', vpcOutputContent, this.options.projectName);

    const vpcModuleContent = dedent`
    module "vpc" {
      source = "./modules/vpc"

      namespace   = var.namespace
    }`;

    injectToFile('main.tf', vpcModuleContent, this.options.projectName, {
      insertAfter: '# VPC',
    });
  }

  private applyS3(): void {
    copyDir('aws/modules/s3', 'modules/s3', this.options.projectName);

    const s3OutputContent = dedent`
    output "s3_alb_log_bucket_name" {
      description = "S3 bucket name for ALB log"
      value       = module.s3.aws_alb_log_bucket_name
    }\n\n`;

    appendToFile('outputs.tf', s3OutputContent, this.options.projectName);

    const s3ModuleContent = dedent`
    module "s3" {
      source = "./modules/s3"

      namespace   = var.namespace
    }`;

    injectToFile('main.tf', s3ModuleContent, this.options.projectName, {
      insertAfter: '# S3',
    });
  }

  private applySsm(): void {
    copyDir('aws/modules/ssm', 'modules/ssm', this.options.projectName);

    const ssmVariablesContent = dedent`
    variable "secret_key_base" {
      description = "The Secret key base for the application"
      type = string
    }\n\n`;
    appendToFile('variables.tf', ssmVariablesContent, this.options.projectName);

    const ssmModuleContent = dedent`
    module "ssm" {
      source = "./modules/ssm"

      namespace = var.namespace
      secret_key_base       = var.secret_key_base

      rds_username      = var.rds_username
      rds_password      = var.rds_password
      rds_database_name = var.rds_database_name
      rds_endpoint      = module.rds.db_endpoint
    }`;

    injectToFile('main.tf', ssmModuleContent, this.options.projectName, {
      insertAfter: '# SSM',
    });
  }

  private applySecurityGroup(): void {
    copyDir(
      'aws/modules/security_group',
      'modules/security_group',
      this.options.projectName,
    );

    const securityGroupVariablesContent = dedent`
    variable "nimble_office_ip" {
      description = "Nimble Office IP"
    }\n\n`;
    appendToFile('variables.tf', securityGroupVariablesContent, this.options.projectName);

    const securityGroupModuleContent = dedent`
    module "security_group" {
      source = "./modules/security_group"

      namespace                   = var.namespace
      vpc_id                      = module.vpc.vpc_id
      app_port                    = var.app_port
      private_subnets_cidr_blocks = module.vpc.private_subnets_cidr_blocks

      nimble_office_ip = var.nimble_office_ip
    }
    `;

    injectToFile('main.tf', securityGroupModuleContent, this.options.projectName, {
      insertAfter: '# Security groups',
    });
  }

  private applyEcr(): void {
    copyDir('aws/modules/ecr', 'modules/ecr', this.options.projectName);

    const ecrVariablesContent = dedent`
    variable "image_limit" {
      description = "Sets max amount of the latest develop images to be kept"
      type        = number
    }\n\n`;
    appendToFile('variables.tf', ecrVariablesContent, this.options.projectName);

    const ecrModuleContent = dedent`
    module "ecr" {
      source = "./modules/ecr"

      namespace   = var.namespace
      image_limit = var.image_limit
    }
    `;

    injectToFile('main.tf', ecrModuleContent, this.options.projectName, {
      insertAfter: '# ECR',
    });
  }

  private applyLog(): void {
    copyDir('aws/modules/log', 'modules/log', this.options.projectName);

    const logModuleContent = dedent`
    module "log" {
      source = "./modules/log"

      namespace = var.namespace
    }
    `;

    injectToFile('main.tf', logModuleContent, this.options.projectName, {
      insertAfter: '# Log',
    });
  }

  private applyAlb(): void {
    copyDir('aws/modules/alb', 'modules/alb', this.options.projectName);

    const albVariablesContent = dedent`
    variable "health_check_path" {
      description = "Application health check path"
      type = string
    }

    variable "domain" {
      description = "Application domain"
      type        = string
    }\n\n`;
    appendToFile('variables.tf', albVariablesContent, this.options.projectName);

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
    `;

    injectToFile('main.tf', albModuleContent, this.options.projectName, {
      insertAfter: '# ALB',
    });

    const vpcOutputContent = dedent`
    output "alb_dns_name" {
      description = "ALB DNS"
      value       = module.alb.alb_dns_name
    }\n\n`;
    appendToFile('outputs.tf', vpcOutputContent, this.options.projectName);
  }

  private applyRds(): void {
    copyDir('aws/modules/rds', 'modules/rds', this.options.projectName);

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
    }\n\n`;
    appendToFile('variables.tf', rdsVariablesContent, this.options.projectName);

    const albModuleContent = dedent`
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
    `;

    injectToFile('main.tf', albModuleContent, this.options.projectName, {
      insertAfter: '# RDS',
    });
  }

  private applyBastionInstance(): void {
    copyDir('aws/modules/bastion', 'modules/bastion', this.options.projectName);

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
    }\n\n`;
    appendToFile('variables.tf', bastionVariablesContent, this.options.projectName);

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
    `;

    injectToFile('main.tf', bastionModuleContent, this.options.projectName, {
      insertAfter: '# Bastion instance',
    });
  }

  private applyEcs(): void {
    copyDir('aws/modules/ecs', 'modules/ecs', this.options.projectName);

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
    }\n\n`;
    appendToFile('variables.tf', bastionVariablesContent, this.options.projectName);

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
    `;

    injectToFile('main.tf', ecsModuleContent, this.options.projectName, {
      insertAfter: '# ECS',
    });
  }
}
