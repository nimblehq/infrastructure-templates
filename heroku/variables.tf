variable "email" {
  description = "Heroku Access Email"
  default = "dev@nimbl3.com"
}

variable "app_name" {
  description = "Application name"
  default = "nimbl3-terraform-test-app"
}

variable "heroku_token" {
  description = "Heroku API Access Token"
  default = "${env.HEROKU_TOKEN}"
}

variable "region" {
  description = "Heroku hosting region"
  default = "us"
}