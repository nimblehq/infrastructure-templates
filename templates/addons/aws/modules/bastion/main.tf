# trivy:ignore:AVD-AWS-0009
resource "aws_launch_configuration" "bastion_instance" {
  name_prefix                 = "${var.env_namespace}-bastion-"
  image_id                    = var.image_id
  instance_type               = var.instance_type
  key_name                    = "${var.env_namespace}-bastion"
  security_groups             = var.instance_security_group_ids
  associate_public_ip_address = true

  lifecycle {
    create_before_destroy = true
  }

  metadata_options {
    http_tokens = "required"
  }

  root_block_device {
    encrypted = true
  }
}

resource "aws_autoscaling_group" "bastion_instance" {
  name                 = "${var.env_namespace}-bastion"
  launch_configuration = aws_launch_configuration.bastion_instance.name
  min_size             = var.min_instance_count
  max_size             = var.max_instance_count
  desired_capacity     = var.instance_desired_count
  vpc_zone_identifier  = var.subnet_ids

  tag {
    key                 = "Name"
    value               = "${var.env_namespace}-bastion"
    propagate_at_launch = true
  }
}
