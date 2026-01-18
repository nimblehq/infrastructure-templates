locals {
  name_prefix = "${var.env_namespace}-bastion"
  metadata_options = {
    http_tokens = "required"
  }
  ebs_encrypted               = true
  associate_public_ip_address = true

  tags = {
    Name = "${var.env_namespace}-bastion"
  }
}
