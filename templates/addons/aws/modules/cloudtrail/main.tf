resource "aws_iam_role" "cloudtrail_cloudwatch" {
  name = "${var.env_namespace}-${var.cloudtrail_event_type}-cloudtrail-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
      }
    ]
  })
}

# trivy:ignore:AVD-AWS-0057 Required by CloudTrail to write logs to CloudWatch
resource "aws_iam_role_policy" "cloudtrail_cloudwatch" {
  name = "${var.env_namespace}-${var.cloudtrail_event_type}-cloudwatch-policy"
  role = aws_iam_role.cloudtrail_cloudwatch.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${var.cloud_watch_arn}:*"
      }
    ]
  })
}

# trivy:ignore:AVD-AWS-0015 Using AWS-managed encryption for simplicity
resource "aws_cloudtrail" "main" {
  #checkov:skip=CKV_AWS_35:Using AWS-managed encryption instead of KMS CMK for simplicity
  #checkov:skip=CKV_AWS_67:Ignore multi-region trails for data events
  name                       = var.trail_name
  s3_bucket_name             = var.s3_bucket_name
  s3_key_prefix              = var.s3_key_prefix
  enable_logging             = var.enable_logging
  enable_log_file_validation = true
  cloud_watch_logs_group_arn = "${var.cloud_watch_arn}:*"
  cloud_watch_logs_role_arn  = aws_iam_role.cloudtrail_cloudwatch.arn

  # Insight selectors - only apply when cloudtrail_event_type is "Insight" or "All"
  dynamic "insight_selector" {
    for_each = contains(["Insight", "All"], var.cloudtrail_event_type) ? [1] : []
    content {
      insight_type = "ApiCallRateInsight"
    }
  }

  dynamic "insight_selector" {
    for_each = contains(["Insight", "All"], var.cloudtrail_event_type) ? [1] : []
    content {
      insight_type = "ApiErrorRateInsight"
    }
  }

  # Data event selectors - only apply when cloudtrail_event_type is "Data" or "All"
  dynamic "advanced_event_selector" {
    for_each = contains(["Data", "All"], var.cloudtrail_event_type) ? [1] : []
    content {
      name = "Log all events except readOnly for all S3 buckets"
      field_selector {
        field  = "eventCategory"
        equals = ["Data"]
      }

      field_selector {
        field           = "resources.ARN"
        not_starts_with = var.s3_ignore_data_bucket_arns
      }

      field_selector {
        field  = "resources.type"
        equals = ["AWS::S3::Object"]
      }

      field_selector {
        field      = "eventName"
        not_equals = ["GetObject"]
      }
    }
  }

  dynamic "advanced_event_selector" {
    for_each = contains(["Data", "All"], var.cloudtrail_event_type) ? [1] : []
    content {
      name = "Exclude PutObject events for ALB and S3 Cloudtrail log buckets"
      field_selector {
        field  = "eventCategory"
        equals = ["Data"]
      }

      field_selector {
        field     = "resources.ARN"
        ends_with = ["-alb-log", var.s3_bucket_name]
      }

      field_selector {
        field  = "resources.type"
        equals = ["AWS::S3::Object"]
      }

      field_selector {
        field      = "eventName"
        not_equals = ["PutObject"]
      }
    }
  }

  # Management event selector - apply when cloudtrail_event_type is "Management" or "All"
  dynamic "advanced_event_selector" {
    for_each = contains(["Management", "All", "Insight"], var.cloudtrail_event_type) ? [1] : []
    content {
      name = "Log all Management events"
      field_selector {
        field  = "eventCategory"
        equals = ["Management"]
      }
    }
  }
}
