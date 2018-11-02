variable "postgres_plan_staging" {
  description = "Heroku postgres db add-on plan (FREE) for Staging"
  default = "heroku-postgresql:hobby-dev"
}

variable "redis_plan_staging" {
  description = "Heroku Redis add-on plan (FREE) for Staging"
  default = "heroku-redis:hobby-dev"
}
