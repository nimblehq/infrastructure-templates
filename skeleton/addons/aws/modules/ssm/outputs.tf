output "secrets_variables" {
  description = "The formatted secrets for ECS task definition"
  value       = local.secrets_variables
}

output "parameter_store_arns" {
  description = "List of parameter store ARNs for granting access to ECS task execution role"
  value       = local.parameter_store_arns
}
