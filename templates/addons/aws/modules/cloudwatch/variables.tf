variable "env_namespace" {
  description = "The namespace with environment for the CloudWatch"
  type        = string
}

variable "log_retention_in_days" {
  description = "How long (days) to retain the log data"
  default     = 14
}
