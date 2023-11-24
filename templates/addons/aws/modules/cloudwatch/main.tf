# trivy:ignore:AVD-AWS-0017
resource "aws_cloudwatch_log_group" "main" {
  name              = "awslogs-${var.env_namespace}-log-group"
  retention_in_days = var.log_retention_in_days
}
