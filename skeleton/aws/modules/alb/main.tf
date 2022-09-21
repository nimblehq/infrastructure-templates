resource "aws_lb" "main" {
  name               = "${var.namespace}-alb"
  internal           = false
  subnets            = var.subnet_ids
  load_balancer_type = "application"
  security_groups    = var.security_group_ids

  enable_deletion_protection = true

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
    for_each = var.enable_stickiness ? [1] : []

    content {
      enabled = var.enable_stickiness
      type    = var.stickiness_type
    }
  }
}

resource "aws_lb_listener" "app_http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}
