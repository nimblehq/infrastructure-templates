output "role_arn" {
  description = "The ARN of the IAM role"
  value       = aws_iam_role.role.arn
}

output "instance_profile_name" {
  description = "The name of the IAM instance profile"
  value       = var.create_instance_profile ? aws_iam_instance_profile.instance_profile[0].name : null
}
