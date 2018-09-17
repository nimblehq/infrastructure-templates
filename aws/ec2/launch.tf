## Creating Launch Configuration
resource "aws_launch_configuration" "hadex-launch-config" {
  count = 0
  image_id               = "${var.ami_type}"
  instance_type          = "${var.instance_type}"
  security_groups        = ["${module.security_group.this_security_group_id}"]
  key_name               = "${data.vault_generic_secret.deploy_key.data["key_name"]}"
  
  lifecycle {
    create_before_destroy = true
  }
}

## Creating AutoScaling Group
resource "aws_autoscaling_group" "hadex-autoscaling" {
  count = 0
  launch_configuration = "${aws_launch_configuration.hadex-launch-config.id}"
  availability_zones = ["${data.aws_availability_zones.all.names}"]
  min_size = 2
  max_size = 10
  load_balancers = ["${aws_lb.hadex-alb.name}"]
  health_check_type = "ELB"
  tag {
    key = "Name"
    value = "terraform-hadex-autoscaling"
    propagate_at_launch = true
  }
}