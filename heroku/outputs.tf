output "app_domain" {
  value = "${heroku_app.default.heroku_hostname}"
}