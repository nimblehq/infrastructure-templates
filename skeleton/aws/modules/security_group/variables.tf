variable "namespace" {
  description = "The namespace for the security groups"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnets_cidr_blocks" {
  description = "Private subnet CIDR blocks"
  type        = list(string)
}

variable "app_port" {
  description = "Application running port"
  type        = number
}

variable "nimble_office_ip" {
  description = "Nimble Office IP"
  type        = string
}
