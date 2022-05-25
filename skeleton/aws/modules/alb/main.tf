data "aws_acm_certificate" "acm" {
  domain   = var.domain
  statuses = ["ISSUED"]
}

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
}

resource "aws_lb_listener" "app_http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "app_https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-Ext-2018-06"
  certificate_arn   = data.aws_acm_certificate.acm.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}
