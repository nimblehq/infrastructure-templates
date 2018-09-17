data "vault_aws_access_credentials" "creds" {
  backend = "aws"
  # TODO: improve this, link to data_remote_state in /vault-aws-iam outputs
  role    = "${terraform.workspace == "staging" ? "hadex-aws-creds-producer-staging" : "hadex-aws-creds-producer"}"
}

data "vault_generic_secret" "deploy_key" {
  path = "secret-v1/hadex/aws-deploy-key"
}

provider "aws" {
  region = "${var.region}"
  access_key = "${data.vault_aws_access_credentials.creds.access_key}"
  secret_key = "${data.vault_aws_access_credentials.creds.secret_key}"
}

# Create a Key Pair of deployer machine and set it to the EC2 Instance at init
resource "aws_key_pair" "deployer" {
  key_name   = "${data.vault_generic_secret.deploy_key.data["key_name"]}"
  public_key = "${data.vault_generic_secret.deploy_key.data["public_key"]}"
}

# Create AWS EC2 Instance
resource "aws_instance" "hadex" {
  count = 1
  ami           = "${var.ami_type}"
  instance_type = "${var.instance_type}"
  monitoring = "${terraform.workspace == "staging" ? false : true}"
  key_name = "${data.vault_generic_secret.deploy_key.data["key_name"]}"
  iam_instance_profile = "${aws_iam_instance_profile.ec2-instance-profile.id}"
  vpc_security_group_ids = ["${module.security_group.this_security_group_id}"]

  tags {
    Name  = "${var.name}"
    TTL   = "${var.ttl}"
    owner = "${var.name}-owner"
  }
}