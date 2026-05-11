variable "role_name" {
  description = "The name of the IAM role"
  type        = string
}

variable "assume_role_services" {
  description = "List of AWS services that can assume this role"
  type        = list(string)
  default     = ["ec2.amazonaws.com"]
}

variable "policy_arns" {
  description = "List of IAM policy ARNs to attach to the role"
  type        = list(string)
  default     = []
}

variable "create_instance_profile" {
  description = "Whether to create an IAM instance profile"
  type        = bool
  default     = false
}
