data "vault_aws_access_credentials" "creds" {
  backend = "aws"
  role    = "dynamic-aws-creds-producer-role"
}

provider "aws" {
  region = "${var.region}"
  access_key = "${data.vault_aws_access_credentials.creds.access_key}"
  secret_key = "${data.vault_aws_access_credentials.creds.secret_key}"
}


# Create AWS EC2 Instance
resource "aws_instance" "main" {
  ami           = "${var.ami_type}"
  instance_type = "${var.instance_type}"

  tags {
    Name  = "${var.name}"
    TTL   = "${var.ttl}"
    owner = "${var.name}-owner"
  }
}