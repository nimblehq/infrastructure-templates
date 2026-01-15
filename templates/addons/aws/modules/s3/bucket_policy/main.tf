resource "aws_s3_bucket_policy" "allow_elb_logging" {
  bucket = var.s3_bucket_name
  policy = jsonencode(var.s3_bucket_policy)
}
