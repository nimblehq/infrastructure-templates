terraform {
  backend "s3" {
    region = "ap-southeast-1"
    bucket = "${var.aws_s3_bucket_terraform_backend}"
    key = "state.tfstate"
    encrypt = true    #AES-256 encryption
  }
}
