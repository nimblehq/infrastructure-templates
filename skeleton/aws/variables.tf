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
  description = "The application environment, used to tag the resources, e.g. `acme-web-staging`"
  type        = string
}

variable "owner" {
  description = "The owner of the infrastructure, used to tag the resources, e.g. `acme-web`"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
}

variable "app_port" {
  description = "Application running port"
  type        = number
}
