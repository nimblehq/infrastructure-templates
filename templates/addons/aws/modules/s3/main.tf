# trivy:ignore:AVD-AWS-0089 trivy:ignore:AVD-AWS-0132 trivy:ignore:AVD-AWS-0088 trivy:ignore:AVD-AWS-0090
resource "aws_s3_bucket" "s3_bucket" {
  bucket        = var.bucket_name
  force_destroy = var.force_destroy
}

resource "aws_s3_bucket_ownership_controls" "s3_bucket_ownership_controls" {
  bucket = aws_s3_bucket.s3_bucket.id
  rule {
    object_ownership = var.object_ownership
  }
}

resource "aws_s3_bucket_acl" "s3_bucket_acl" {
  count  = var.object_ownership == "ObjectWriter" ? 1 : 0
  bucket = aws_s3_bucket.s3_bucket.id
  acl    = "private"

  depends_on = [
    aws_s3_bucket_ownership_controls.s3_bucket_ownership_controls
  ]
}

resource "aws_s3_bucket_public_access_block" "s3_bucket_public_access_block" {
  bucket                  = aws_s3_bucket.s3_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Add versioning to S3 bucket
resource "aws_s3_bucket_versioning" "s3_bucket_versioning" {
  bucket = aws_s3_bucket.s3_bucket.id
  count  = var.versioning_enabled ? 1 : 0

  versioning_configuration {
    status = var.versioning_enabled ? "Enabled" : "Disabled"
  }
}

# Add lifecycle configuration to S3 bucket
resource "aws_s3_bucket_lifecycle_configuration" "s3_bucket_lifecycle_configuration" {
  #checkov:skip=CKV_AWS_300:Failed uploads rule not needed for CloudTrail logs
  bucket = aws_s3_bucket.s3_bucket.id
  count  = var.lifecycle_configuration != null ? 1 : 0

  rule {
    id     = var.lifecycle_configuration.id
    status = var.lifecycle_configuration.status

    # Filter is required in newer AWS provider versions
    filter {
      prefix = var.lifecycle_configuration.filter.prefix
    }

    expiration {
      days = var.lifecycle_configuration.expiration.days
    }
  }
}
