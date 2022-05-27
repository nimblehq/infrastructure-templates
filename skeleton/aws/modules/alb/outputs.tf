output "alb_name" {
  description = "Application LB name"
  value       = aws_lb.main.name
}

output "alb_dns_name" {
  description = "Application LB DNS name"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "Application LB Zone ID"
  value       = aws_lb.main.zone_id
}

output "alb_target_group_arn" {
  description = "ALB target group ARN"
  value       = aws_lb_target_group.target_group.arn
}
