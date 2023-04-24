locals {
  user_accounts = var.has_login ? aws_iam_user.user_account : {}
}

resource "aws_iam_user" "user_account" {
  for_each = toset(var.usernames)

  name = each.value
  path = var.path

  force_destroy = true
}

resource "aws_iam_user_login_profile" "user_account" {
  for_each = local.user_accounts

  user                    = each.value.name
  password_reset_required = true

  lifecycle {
    ignore_changes = [
      password_reset_required,
    ]
  }
}
