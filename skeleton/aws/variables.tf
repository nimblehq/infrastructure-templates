variable "terraform_organization" {
  description = "Organization name on Terraform Cloud"
}
variable "terraform_workspace" {
  description = "Workspace name on Terraform cloud"
}

variable "region" {
  description = "AWS region"
  default = "ap-southeast-1"
}

variable "environment" {
  description = "The environment tag"
}

variable "owner" {
  description = "The owner tag"
}
