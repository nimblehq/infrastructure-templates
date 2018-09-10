variable "name" { 
  default = "dynamic-aws-creds-consumer" 
}

variable "ttl"  { 
  default = "1" 
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

variable "region" {
  description = "AWS Region"
  default = "ap-southeast-1"
}

variable "ami_type" {
  description = "ID of the AMI to provision. Default is Amazon Linux AMI 2018.03.0 (HVM), SSD Volume Type"
  default = "ami-08569b978cc4dfa10"
}

variable "instance_type" {
  description = "type of EC2 instance to provision. (FREE plan)"
  default = "t2.micro"
}