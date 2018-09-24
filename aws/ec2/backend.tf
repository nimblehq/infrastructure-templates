terraform {
  backend "s3" {
    region = "ap-southeast-1"
    bucket = "com.nimbl3.hadex-terraform-backend"
    key = "aws-setup/state.tfstate"
    encrypt = true    #AES-256 encryption
  }
}