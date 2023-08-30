variable "namespace" {
  description = "The namespace for the LB"
  type        = string
}

variable "subnet_ids" {
  description = "A list of subnet IDs to attach to the LB"
  type        = list(string)
}

variable "security_group_ids" {
  description = "A list of security group IDs to assign to the LB"
  type        = list(string)
}

variable "health_check_path" {
  description = "The health check path of the Application"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "app_port" {
  description = "Application running port"
  type        = number
}
