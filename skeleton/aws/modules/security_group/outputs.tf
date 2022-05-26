output "alb_security_group_ids" {
  description = "Security group IDs for ALB"
  value       = [aws_security_group.alb.id]
}

output "bastion_security_group_ids" {
  description = "Security group IDs for Bastion"
  value       = [aws_security_group.bastion.id]
}

output "rds_security_group_ids" {
  description = "Security group IDs for Aurora"
  value       = [aws_security_group.rds.id]
}

output "ecs_security_group_ids" {
  description = "Security group IDs for ECS Fargate"
  value       = [aws_security_group.ecs_fargate.id]
}
