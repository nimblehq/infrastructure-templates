provider "heroku" {
  version = "~> 1.3"
}

resource "heroku_app" "default" {
  name = "${var.app_name}-${terraform.workspace}"
  region = "${var.region}"
  organization = {
    name = "${var.app_organization}"
  }
}

resource "heroku_addon" "database" {
  app = "${heroku_app.default.name}"
  plan = "${terraform.workspace == "staging" ? var.postgres_plan_staging : var.postgres_plan}"
}

resource "heroku_addon" "sentry" {
  app = "${heroku_app.default.name}"
  plan = "${var.sentry_plan}"
}

resource "heroku_addon" "redis" {
  app = "${heroku_app.default.name}"
  plan = "${terraform.workspace == "staging" ? var.redis_plan_staging : var.redis_plan}"
}
