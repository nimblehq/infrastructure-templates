terraform {
  cloud {
    organization = var.terraform_organization

    workspaces {
      name = var.terraform_workspace
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
