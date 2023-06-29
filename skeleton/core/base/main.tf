terraform {
  cloud {
    organization = "organization"

    workspaces {
      name = "terraform_workspace"
    }
  }

  # Terraform version
  required_version = "1.5.2"
}
