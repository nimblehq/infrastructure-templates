variable "s3_bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
}

variable "s3_bucket_policy" {
  description = "The S3 bucket policy in JSON format."
  type        = any
  default     = {}
}
