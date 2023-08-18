output "admin_group" {
  description = "IAM Group with admin permissions"
  value       = aws_iam_group.admin.name
}

output "developer_group" {
  description = "IAM Group with developer permissions"
  value       = aws_iam_group.developer.name
}

output "bot_group" {
  description = "IAM Group with bot permissions"
  value       = aws_iam_group.bot.name
}
