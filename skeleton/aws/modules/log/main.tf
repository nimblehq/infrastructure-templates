resource "aws_cloudwatch_log_group" "main" {
  name              = "awslogs-${var.namespace}-log-group"
  retention_in_days = var.log_retention_in_days
}
