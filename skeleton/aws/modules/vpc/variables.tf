variable "namespace" {
}

variable "cidr" {
  description = "VPC CIDR"
  default     = "10.0.0.0/16"
}

variable "private_subnet_cidrs" {
  type    = list(any)
  default = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnet_cidrs" {
  type    = list(any)
  default = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
}

variable "enable_nat_gateway" {
  type    = bool
  default = true
}

variable "single_nat_gateway" {
  type    = bool
  default = true
}

variable "one_nat_gateway_per_az" {
  type    = bool
  default = false
}

variable "enable_dns_hostnames" {
  type    = bool
  default = true
}

variable "environment" {}

variable "owner" {}
