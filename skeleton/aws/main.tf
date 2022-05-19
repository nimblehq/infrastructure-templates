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
}
