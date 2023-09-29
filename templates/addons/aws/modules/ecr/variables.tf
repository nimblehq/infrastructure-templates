variable "env_namespace" {
  description = "The namespace with environment for the ECR"
  type        = string
}

variable "image_limit" {
  description = "Sets max amount of the latest develop images to be kept, e.g. 5"
  type        = number
}
