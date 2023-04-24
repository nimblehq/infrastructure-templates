resource "aws_iam_group_membership" "group" {
  name = var.name

  group = var.group
  users = var.users
}
