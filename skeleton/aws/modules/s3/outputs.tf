output "aws_alb_log_bucket_name" {
  description = "S3 bucket name for ALB logging"
  value       = aws_s3_bucket.alb_log.bucket
}
