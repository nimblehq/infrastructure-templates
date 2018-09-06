provider "heroku" {
  version = "~> 1.3"
  email = "${var.email}"
  api_key = "${var.heroku_token}"
}

resource "heroku_app" "default" {
  name = "${var.app_name}"
  region = "${var.region}"
}

resource "heroku_addon" "database" {
  app = "${heroku_app.default.name}"
  plan = "heroku-postgresql:hobby-dev"
}

resource "heroku_addon" "newrelic" {
  app = "${heroku_app.default.name}"
  plan = "newrelic:wayne"
}

resource "heroku_addon" "papertrail" {
  app = "${heroku_app.default.name}"
  plan = "papertrail:choklad"
}

resource "heroku_addon" "sentry" {
  app = "${heroku_app.default.name}"
  plan = "sentry:f1"
}

resource "heroku_addon" "redis" {
  app = "${heroku_app.default.name}"
  plan = "heroku-redis:hobby-dev"
}