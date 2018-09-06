provider "heroku" {
  version = "~> 1.3"
  email = "${var.heroku_email}"
  api_key = "${var.heroku_token}"
}

resource "heroku_app" "default" {
  name = "${var.app_name}-${terraform.workspace}"
  region = "${var.region}"
}

resource "heroku_addon" "database" {
  app = "${heroku_app.default.name}"
  plan = "${terraform.workspace == "staging" ? var.postgres_plan_staging : var.postgres_plan}"
}

resource "heroku_addon" "newrelic" {
  app = "${heroku_app.default.name}"
  plan = "${terraform.workspace == "staging" ? var.newrelic_plan_staging : var.newrelic_plan}"
}

resource "heroku_addon" "papertrail" {
  app = "${heroku_app.default.name}"
  plan = "${terraform.workspace == "staging" ? var.papertrail_plan_staging : var.papertrail_plan}"
}
/* Only enable Sentry for Production
resource "heroku_addon" "sentry" {
  app = "${heroku_app.default.name}"
  plan = "${var.sentry_plan}"
}
*/

resource "heroku_addon" "redis" {
  app = "${heroku_app.default.name}"
  plan = "${terraform.workspace == "staging" ? var.redis_plan_staging : var.redis_plan}"
}
