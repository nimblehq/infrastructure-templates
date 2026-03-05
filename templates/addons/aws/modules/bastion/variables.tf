variable "env_namespace" {
  description = "The namespace with environment for the bastion instance"
  type        = string
}

variable "subnet_ids" {
  description = "The public subnet IDs for the instance"
  type        = list(string)
}

variable "instance_security_group_ids" {
  description = "The security group IDs for the instance"
  type        = list(string)
}

variable "instance_type" {
  description = "The instance type"
  default     = "t3.nano"
}

variable "instance_desired_count" {
  description = "The desired number of the instance"
  default     = 1
}

variable "max_instance_count" {
  description = "The maximum number of the instance"
  default     = 1
}

variable "min_instance_count" {
  description = "The minimum number of the instance"
  default     = 1
}

variable "volume_size" {
  description = "The size of the EBS volume in GB"
  type        = number
  default     = 100
}

variable "device_name" {
  description = "The device name for the EBS volume"
  type        = string
  default     = "/dev/xvda"
}

variable "iam_instance_profile" {
  description = "The name of the IAM instance profile for the instance"
  type        = string
  default     = ""
}
