output "vpc_flow_log_arn" {
  description = "The ARN of the VPC Flow Log"
  value       = aws_flow_log.vpc_flow_log.arn
}

output "vpc_flow_log_athena_table_arn" {
  description = "The arn of the Athena table for VPC Flow Logs"
  value       = aws_glue_catalog_table.vpc_flow_log_table.arn
}

