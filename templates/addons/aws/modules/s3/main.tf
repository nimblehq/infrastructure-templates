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
