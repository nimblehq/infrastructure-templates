terraform {
  cloud {
    organization = "organization"

    workspaces {
      name = "terraform_workspace"
    }
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Environment = var.environment
      Owner       = var.owner
    }
  }
}

# VPC

# Security groups

# ECR

# Log

# S3

# ALB

# RDS

# Bastion instance

# SSM

# ECS
