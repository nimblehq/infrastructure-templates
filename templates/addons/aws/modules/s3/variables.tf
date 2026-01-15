variable "env_namespace" {
  description = "The namespace with environment for the S3 buckets, used as the prefix for the bucket names, e.g. acme-web-staging"
  type        = string
}

variable "bucket_name" {
  description = "The name of the S3 bucket to create, used as the suffix for the bucket name."
  type        = string
}

variable "force_destroy" {
  description = "Whether to force destroy the S3 bucket when deleting. Set to true to delete all objects in the bucket."
  type        = bool
  default     = true
}

variable "object_ownership" {
  description = "The S3 Object Ownership setting for the bucket. Valid values are 'BucketOwnerPreferred' and 'ObjectWriter'"
  type        = string
  default     = "ObjectWriter"
}

variable "versioning_enabled" {
  description = "Whether to enable versioning for the S3 bucket."
  type        = bool
  default     = false
}

variable "lifecycle_configuration" {
  description = "The lifecycle configuration for the S3 bucket."
  type = object({
    id     = string
    status = string
    filter = object({
      prefix = string
    })
    expiration = object({
      days = number
    })
  })
  default = null
}
