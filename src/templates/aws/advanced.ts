import * as dedent from "dedent";
import { GenerateOption } from "../../commands/generate";
import {
  appendToFile,
  copyDir,
  copyFile,
  injectToFile,
} from "../../helpers/file";

export default class Advanced {
  options: GenerateOption;

  constructor(options: GenerateOption) {
    this.options = options;
  }

  static run(options: GenerateOption): void {
    const advanced = new Advanced(options);
    advanced.applyTemplate();
  }

  private applyTemplate(): void {
    this.applyCommon();
    this.applyVpc();
    this.applySecurityGroup();
    // this.applyEcr();
    // this.applyLog();
    this.applyS3();
    this.applyAlb();
    // this.applyRds();
    this.applyBastionInstance();
    this.applySsm();
    this.applySsm();
  }

  private applyCommon(): void {
    copyFile("aws/main.tf", "main.tf", this.options);
    copyFile("aws/outputs.tf", "outputs.tf", this.options);
    copyFile("aws/variables.tf", "variables.tf", this.options);
  }

  private applyVpc(): void {
    copyDir("aws/modules/vpc", "modules/vpc", this.options);

    const vpcOutputContent = dedent`
    output "vpc_id" {
      description = "VPC ID"
      value       = "module.vpc.vpc_id"
    }\n\n`;
    appendToFile("outputs.tf", vpcOutputContent, this.options);

    const vpcModuleContent = dedent`
    module "vpc" {
      source = "./modules/vpc"

      namespace   = var.namespace
    }`;

    injectToFile("main.tf", vpcModuleContent, this.options, {
      insertAfter: "# VPC",
    });
  }

  private applyS3(): void {
    copyDir("aws/modules/s3", "modules/s3", this.options);

    const s3OutputContent = dedent`
    output "s3_alb_log_bucket_name" {
      description = "S3 bucket name for ALB log"
      value       = "module.s3.aws_alb_log_bucket_name"
    }\n\n`;

    appendToFile("outputs.tf", s3OutputContent, this.options);

    const s3ModuleContent = dedent`
    module "s3" {
      source = "./modules/s3"

      namespace   = var.namespace
    }`;

    injectToFile("main.tf", s3ModuleContent, this.options, {
      insertAfter: "# S3",
    });
  }

  private applySsm(): void {
    copyDir("aws/modules/ssm", "modules/ssm", this.options);

    const ssmVariablesContent = dedent`
    variable "secret_key_base" {
      description = "The Secret key base for the application"
      type = string
    }

    variable "aws_access_key_id" {
      description = "AWS access key ID"
      type        = string
    }

    variable "aws_secret_access_key" {
      description = "AWS secret access key"
      type        = string
    }

    variable "rds_database_name" {
      description = "RDS database name"
      type        = string
    }

    variable "rds_username" {
      description = "RDS username"
      type        = string
    }

    variable "rds_password" {
      description = "RDS password"
      type        = string
    }\n\n`;
    appendToFile("variables.tf", ssmVariablesContent, this.options);

    const ssmModuleContent = dedent`
    module "ssm" {
      source = "../modules/ssm"

      namespace = var.namespace
      secret_key_base       = var.secret_key_base

      aws_access_key_id     = var.aws_access_key_id
      aws_secret_access_key = var.aws_secret_access_key

      rds_username      = var.rds_username
      rds_password      = var.rds_password
      rds_database_name = var.rds_database_name
      rds_endpoint      = module.db.db_endpoint
    }`;

    injectToFile("main.tf", ssmModuleContent, this.options, {
      insertAfter: "# SSM",
    });
  }

  private applySecurityGroup(): void {
    copyDir(
      "aws/modules/security_group",
      "modules/security_group",
      this.options
    );

    const ssmVariablesContent = dedent`
    variable "nimble_office_ip" {
      description = "Nimble Office IP"
    }\n\n`;
    appendToFile("variables.tf", ssmVariablesContent, this.options);

    const ssmModuleContent = dedent`
    module "security_group" {
      source = "../modules/security_group"

      namespace                   = var.app_name
      vpc_id                      = module.vpc.vpc_id
      app_port                    = var.app_port
      private_subnets_cidr_blocks = module.vpc.private_subnets_cidr_blocks

      nimble_office_ip = var.nimble_office_ip
    }
    `;

    injectToFile("main.tf", ssmModuleContent, this.options, {
      insertAfter: "# Security groups",
    });
  }

  private applyAlb(): void {
    copyDir("aws/modules/alb", "modules/alb", this.options);

    const albVariablesContent = dedent`
    variable "health_check_path" {
      description = "Application health check path"
      type = string
    }

    variable "domain" {
      description = "Application domain"
      type        = string
    }\n\n`;
    appendToFile("variables.tf", albVariablesContent, this.options);

    const albModuleContent = dedent`
    module "alb" {
      source = "../modules/alb"

      vpc_id             = module.vpc.vpc_id
      namespace          = var.app_name
      app_port           = var.app_port
      subnet_ids         = module.vpc.public_subnet_ids
      security_group_ids = module.security_group.alb_security_group_ids
      domain  = var.domain
      health_check_path  = var.health_check_path
    }
    `;

    injectToFile("main.tf", albModuleContent, this.options, {
      insertAfter: "# S3",
    });
  }

  private applyBastionInstance(): void {
    copyDir("aws/modules/bastion", "modules/bastion", this.options);

    const bastionVariablesContent = dedent`
    variable "bastion_image_id" {
      description = "The AMI image ID for the bastion instance"
      default = "ami-0801a1e12f4a9ccc0"
    }

    variable "bastion_instance_type" {
      description = "The bastance instance type"
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
    appendToFile("variables.tf", bastionVariablesContent, this.options);

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
    }
    `;

    injectToFile("main.tf", bastionModuleContent, this.options, {
      insertAfter: "# Bastion instance",
    });
  }
}
