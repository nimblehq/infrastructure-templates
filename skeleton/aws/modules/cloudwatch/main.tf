# tfsec:ignore:aws-cloudwatch-log-group-customer-key
resource "aws_cloudwatch_log_group" "main" {
  name              = "awslogs-${var.namespace}-log-group"
  retention_in_days = 14 # days
}
