output "aws_s3_bucket_name" {
  description = "S3 bucket name for ALB logging"
  value       = aws_s3_bucket.s3_bucket.bucket
}
