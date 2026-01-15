variable "env_namespace" {
  description = "The namespace with environment for the CloudTrail"
  type        = string
}

variable "trail_name" {
  description = "Name of the CloudTrail trail."
  type        = string
}

variable "cloudtrail_event_type" {
  description = "Type of events that the trail will log. Valid values are 'All', 'Management', 'Data' and 'Insight'."
  type        = string
  default     = "Management"
  validation {
    condition     = contains(["All", "Management", "Data", "Insight"], var.cloudtrail_event_type)
    error_message = "cloudtrail_event_type must be one of 'All', 'Management', 'Data', or 'Insight'."
  }
}

variable "s3_bucket_name" {
  description = "Name for the S3 bucket to store CloudTrail logs."
  type        = string
}

variable "s3_key_prefix" {
  description = "S3 key prefix for the CloudTrail logs."
  type        = string
  default     = "cloudtrail"
}

variable "s3_ignore_data_bucket_arns" {
  description = "List of S3 bucket ARNs to exclude from Data Events logging."
  type        = list(string)
  default     = []
}

variable "enable_logging" {
  description = "Enables logging for the trail."
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "Number of days to retain CloudTrail logs in CloudWatch Logs."
  type        = number
  default     = 30
}


variable "cloud_watch_arn" {
  description = "ARN of the CloudWatch log group for CloudTrail logs."
  type        = string
}
