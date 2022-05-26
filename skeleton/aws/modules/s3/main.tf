data "aws_elb_service_account" "elb_service_account" {}

resource "aws_s3_bucket" "alb_log" {
  bucket = "${var.namespace}-alb-log"
}

resource "aws_s3_bucket_acl" "alb_log_bucket_acl" {
  bucket = aws_s3_bucket.alb_log.id
  acl    = "private"
}

locals {
  aws_s3_bucket_policy = {
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = [
            "${data.aws_elb_service_account.elb_service_account.arn}"
          ]
        }
        Action   = "s3:PutObject"
        Resource = "arn:aws:s3:::${aws_s3_bucket.alb_log.id}/AWSLogs/*"
      },
      {
        Effect = "Allow",
        Principal = {
          Service = "delivery.logs.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "arn:aws:s3:::${aws_s3_bucket.alb_log.id}/AWSLogs/*",
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      },
      {
        Effect = "Allow",
        Principal = {
          Service = "delivery.logs.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = "arn:aws:s3:::${aws_s3_bucket.alb_log.id}"
      }
    ]
  }
}

resource "aws_s3_bucket_policy" "allow_elb_logging" {
  bucket = aws_s3_bucket.alb_log.id
  policy = jsonencode(local.aws_s3_bucket_policy)
}
