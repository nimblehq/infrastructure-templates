output "temporary_passwords" {
  value = { for username, login_profile in aws_iam_user_login_profile.user_account : username => login_profile.password }
}
