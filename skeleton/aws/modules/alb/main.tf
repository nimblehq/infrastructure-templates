# tfsec:ignore:aws-elb-alb-not-public
locals {
  enable_stickiness = false
}

resource "aws_lb" "main" {
  name               = "${var.namespace}-alb"
  internal           = false
  subnets            = var.subnet_ids
  load_balancer_type = "application"
  security_groups    = var.security_group_ids

  enable_deletion_protection = true
  drop_invalid_header_fields = true

  access_logs {
    bucket  = "${var.namespace}-alb-log"
    enabled = true
  }
}

resource "aws_lb_target_group" "target_group" {
  name                 = "${var.namespace}-alb-tg"
  port                 = var.app_port
  protocol             = "HTTP"
  vpc_id               = var.vpc_id
  target_type          = "ip"
  deregistration_delay = 100

  health_check {
    healthy_threshold   = 3
    interval            = 5
    protocol            = "HTTP"
    matcher             = "200-299"
    timeout             = 3
    path                = var.health_check_path
    port                = var.app_port
    unhealthy_threshold = 2
  }

  dynamic "stickiness" {
    for_each = local.enable_stickiness ? [1] : []

    content {
      enabled = local.enable_stickiness
      type    = "lb_cookie"
    }
  }
}

# tfsec:ignore:aws-elb-http-not-used
resource "aws_lb_listener" "app_http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}
