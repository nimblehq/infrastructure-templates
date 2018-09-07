variable "default-aws-region" {
    default = "ap-southeast-1"
}

variable "aws_s3_bucket_terraform_backend" {
  description = "S3 bucket to store Terraform state"
  default = "com.nimbl3.aws-terraform"
}

variable "aws_s3_bucket" {
  description = "S3 bucket for the Production application"
  default = "com.nimbl3.app-bucket"
}
variable "aws_s3_bucket_staging" {
  description = "S3 bucket for the Staging application"
  default = "com.nimbl3.app-bucket-staging"
}
