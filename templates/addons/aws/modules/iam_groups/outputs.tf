output "admin_group" {
  description = "IAM Group with admin permissions"
  value       = aws_iam_group.admin.name
}

output "developer_group" {
  description = "IAM Group with developer permissions"
  value       = aws_iam_group.developer.name
}

output "infra_service_account_group" {
  description = "IAM Group with infra-service-account permissions"
  value       = aws_iam_group.infra-service-account.name
}
