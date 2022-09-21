variable "namespace" {
  description = "Namespace for the VPCs, used as the prefix for the VPC names, e.g. acme-web-staging"
  type        = string
}

variable "cidr" {
  description = "VPC CIDR"
  default     = "10.0.0.0/16"
}

variable "private_subnet_cidrs" {
  description = "VPC private subnet CIDRs"
  type        = list(any)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnet_cidrs" {
  description = "VPC public subnet CIDRs"
  type        = list(any)
  default     = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
}

variable "enable_nat_gateway" {
  description = "VPC NAT gateway flag"
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "VPC single NAT gateway flag"
  type        = bool
  default     = true
}

variable "one_nat_gateway_per_az" {
  description = "VPC one NAT gateway per AZ flag"
  type        = bool
  default     = false
}

variable "enable_dns_hostnames" {
  description = "VPC DNS hostnames flag"
  type        = bool
  default     = true
}
