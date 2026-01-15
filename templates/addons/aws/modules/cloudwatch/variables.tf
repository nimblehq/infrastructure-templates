variable "cloud_watch_name" {
  description = "The name of the CloudWatch log group"
  type        = string
}

variable "log_retention_in_days" {
  description = "How long (days) to retain the log data"
  default     = 14
}
