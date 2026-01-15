output "cloudtrail_arn" {
  description = "The Amazon Resource Name (ARN) of the CloudTrail."
  value       = aws_cloudtrail.main.arn
}
