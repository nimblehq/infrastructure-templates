variable "heroku_email" {
  description = "Heroku Access Email"
}

variable "heroku_token" { 
  description = "Heroku Access Token"
}

variable "app_name" {
  description = "Application name"
  default = "nimbl3-terra-app"
}

variable "app_organization" {
  description = "Name of the organization the app will be under"
  default = "nimbl3"
}

variable "region" {
  description = "Heroku hosting region"
  default = "us"
}

variable "postgres_plan" {
  description = "Heroku postgres db add-on plan (FREE)"
  default = "heroku-postgresql:hobby-dev"
}

variable "sentry_plan" {
  description = "Heroku Sentry add-on plan (FREE)"
  default = "sentry:f1"
}

variable "redis_plan" {
  description = "Heroku Redis add-on plan (FREE)"
  default = "heroku-redis:hobby-dev"
}
