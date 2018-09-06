variable "postgres_plan_staging" {
  description = "Heroku postgres db add-on plan (FREE) for Staging"
  default = "heroku-postgresql:hobby-dev"
}

variable "newrelic_plan_staging" {
  description = "Heroku Newrelic add-on plan (FREE) for Staging"
  default = "newrelic:wayne"
}

variable "papertrail_plan_staging" {
  description = "Heroku Papertrail add-on plan (FREE) for Staging"
  default = "papertrail:choklad"
}

variable "redis_plan_staging" {
  description = "Heroku Redis add-on plan (FREE) for Staging"
  default = "heroku-redis:hobby-dev"
}
