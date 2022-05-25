variable "namespace" {
  type = string
}

variable "owner" {
  type = string
}

variable "image_limit" {
  description = "Sets max amount of the latest develop images to be kept"
  type        = number
}
