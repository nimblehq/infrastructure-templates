terraform {
  backend "s3" {
    region = "ap-southeast-1"
    bucket = "com.nimbl3.terraform-test-backend"
    key = "state.tfstate"
    encrypt = true    #AES-256 encryption
  }
}
