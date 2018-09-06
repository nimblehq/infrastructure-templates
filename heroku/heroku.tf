provider "heroku" {
  version = "~> 1.3"
  email = "${var.heroku_account_email}"
  api_key = "${var.heroku_token}"
}

resource "heroku_app" "default" {
  name = "${var.app_name}"
  region = "${var.region}"
}

resource "heroku_addon" "database" {
  app = "${heroku_app.default.name}"
  plan = "${var.postgres_plan}"
}

resource "heroku_addon" "newrelic" {
  app = "${heroku_app.default.name}"
  plan = "${var.newrelic_plan}"
}

resource "heroku_addon" "papertrail" {
  app = "${heroku_app.default.name}"
  plan = "${var.papertrail_plan}"
}

resource "heroku_addon" "sentry" {
  app = "${heroku_app.default.name}"
  plan = "${var.sentry_plan}"
}

resource "heroku_addon" "redis" {
  app = "${heroku_app.default.name}"
  plan = "${var.redis_plan}"
}