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

variable "region" {
  description = "Heroku hosting region"
  default = "us"
}

variable "postgres_plan" {
  description = "Heroku postgres db add-on plan (FREE)"
  default = "heroku-postgresql:hobby-dev"
}

variable "newrelic_plan" {
  description = "Heroku Newrelic add-on plan (FREE)"
  default = "newrelic:wayne"
}

variable "papertrail_plan" {
  description = "Heroku Papertrail add-on plan (FREE)"
  default = "papertrail:choklad"
}

variable "sentry_plan" {
  description = "Heroku Sentry add-on plan (FREE)"
  default = "sentry:f1"
}

variable "redis_plan" {
  description = "Heroku Redis add-on plan (FREE)"
  default = "heroku-redis:hobby-dev"
}
