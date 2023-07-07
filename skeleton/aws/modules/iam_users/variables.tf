variable "usernames" {
  description = "Desired names for the IAM user"
  type        = list(string)
}

variable "path" {
  description = "Desired path for the IAM user"
  default     = "/"
}

variable "has_login" {
  description = "Boolean for whether login is enabled"
  default     = true
}
