terraform {
  cloud {
    organization = "organization"

    workspaces {
      name = "terraform_workspace"
    }
  }

  # Terraform version
  required_version = "~> 1.2.4"

  # Provider versions
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
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
