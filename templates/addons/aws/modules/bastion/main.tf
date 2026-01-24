# trivy:ignore:AVD-AWS-0009
resource "aws_launch_template" "bastion_instance" {
  name_prefix   = "${local.name_prefix}-"
  image_id      = data.aws_ami.amazon_linux_2023.id
  instance_type = var.instance_type
  key_name      = var.key_name

  iam_instance_profile {
    name = var.iam_instance_profile
  }

  metadata_options {
    http_tokens = local.metadata_options.http_tokens
  }

  block_device_mappings {
    device_name = var.device_name

    ebs {
      encrypted   = local.ebs_encrypted
      volume_size = var.volume_size
    }
  }

  network_interfaces {
    associate_public_ip_address = local.associate_public_ip_address
    security_groups             = var.instance_security_group_ids
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "bastion_instance" {
  name                = local.name_prefix
  min_size            = var.min_instance_count
  max_size            = var.max_instance_count
  desired_capacity    = var.instance_desired_count
  vpc_zone_identifier = var.subnet_ids

  launch_template {
    id      = aws_launch_template.bastion_instance.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = local.tags.Name
    propagate_at_launch = true
  }
}
