terraform {
  backend "s3" {
    region = "ap-southeast-1"
    bucket = "com.nimbl3.hadex-terraform-backend"
    key = "vault-aws-iam/state.tfstate"
    encrypt = true    #AES-256 encryption
  }
}