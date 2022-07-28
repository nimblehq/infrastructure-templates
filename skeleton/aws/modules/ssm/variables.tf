variable "namespace" {
  description = "The namespace for the SSM Parameters, e.g. acme-web-staging"
  type        = string
}

variable "secret_key_base" {
  description = "The Secret key base for the application"
  type        = string
}

variable "rds_username" {
  description = "The DB master username: 1–16 alphanumeric characters and underscores, first character must be a letter, can't be a word reserved by the database engine."
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
