variable "terraform_organization" {
  description = "Organization name on Terraform Cloud"
  type        = string
}

variable "terraform_workspace" {
  description = "Workspace name on Terraform cloud"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "environment" {
  description = "The environment tag"
  type        = string
}

variable "owner" {
  description = "The owner tag"
  type        = string
}
