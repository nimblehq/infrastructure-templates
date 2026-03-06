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

variable "s3_key_prefix" {
  description = "The prefix for the S3 key to store the flow logs."
  type        = string
  default     = ""
}

variable "log_retention_days" {
  description = "The number of days to retain the flow logs in S3."
  type        = number
  default     = 30
}

variable "query_year_ranges" {
  description = "The range of years to query in Athena. Format: 'start_year,end_year'. Update the range as needed."
  type        = string
}
