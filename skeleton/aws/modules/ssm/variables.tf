variable "namespace" {
  description = "The namespace for the SSM Parameters, e.g. acme-web-staging"
  type        = string
}

variable "secrets" {
  description = "Map of secrets to keep in AWS SSM Parameter Store"
  type        = map(string)
  default     = {}
}
