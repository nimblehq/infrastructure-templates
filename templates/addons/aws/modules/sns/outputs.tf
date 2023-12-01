output "aws_sns_plaform_mobile_push_notifications_arn" {
  description = "ARN of SNS Plaform for mobile push notifications"
  value       = aws_sns_platform_application.mobile_push_notifications.arn
}
