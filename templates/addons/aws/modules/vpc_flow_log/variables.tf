variable "env_namespace" {
  description = "The namespace with environment for the VPC Flow Logs."
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC to create the endpoint in."
  type        = string
}

variable "s3_bucket_name" {
  description = "The name of the S3 bucket to store the flow logs."
  type        = string
}

variable "log_retention_days" {
  description = "The number of days to retain the flow logs in S3."
  type        = number
  default     = 90
}
