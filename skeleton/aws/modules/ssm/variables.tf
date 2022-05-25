variable "namespace" {
  description = "The namespace for the SSM Parameters"
  type        = string
}

variable "secret_key_base" {
  description = "The Secret key base for the application"
  type        = string
}

variable "rds_username" {
  description = "The DB username for building DB URL"
  type        = string
}

variable "rds_password" {
  description = "The DB password for building DB URL"
  type        = string
}

variable "rds_endpoint" {
  description = "The DB endpoint for building DB URL"
  type        = string
}

variable "rds_database_name" {
  description = "The DB name for building DB URL"
  type        = string
}

variable "aws_access_key_id" {
  description = "AWS access key ID"
  type        = string
}

variable "aws_secret_access_key" {
  description = "AWS secret access key"
  type        = string
}
