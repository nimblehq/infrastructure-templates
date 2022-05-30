variable "namespace" {
  description = "The namespace for the ECS"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "app_host" {
  description = "Application host name"
  type        = string
}

variable "app_port" {
  description = "Application running port"
  type        = number
}

variable "ecr_repo_name" {
  description = "ECR repo name"
  type        = string
}

variable "ecr_tag" {
  description = "ECR tag to deploy"
  type        = string
}

variable "subnets" {
  description = "Subnet where ECS placed"
  type        = list(string)
}

variable "security_groups" {
  description = "One or more VPC security groups associated with ECS cluster"
  type        = list(string)
}

variable "alb_target_group_arn" {
  description = "ALB target group ARN"
}

variable "cpu" {
  description = "ECS task definition CPU"
  type        = number
}

variable "memory" {
  description = "ECS task definition memory"
  type        = number
}

variable "deployment_maximum_percent" {
  description = "Upper limit of the number of running tasks running during deployment"
  type        = number
}

variable "deployment_minimum_healthy_percent" {
  description = "Lower limit of the number of running tasks running during deployment"
  type        = number
}

variable "desired_count" {
  description = "ECS task definition instance number"
  type        = number
}

variable "container_memory" {
  description = "ECS task container memory"
  type        = number
}

variable "aws_cloudwatch_log_group_name" {
  description = "AWS CloudWatch Log Group name"
  type        = string
}

variable "aws_parameter_store" {
  description = "AWS parameter store"
  type        = map(any)
}
