variable "env_namespace" {
  description = "The namespace with environment for the ECS"
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
  description = "ECR repo name, e.g. 'acme-web'"
  type        = string
}

variable "ecr_tag" {
  description = "ECR tag to deploy, e.g. 'acme-web'"
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
  description = "ECS task definition CPU, e.g. 512"
  type        = number
}

variable "memory" {
  description = "ECS task definition memory, e.g. 1024"
  type        = number
}

variable "deployment_maximum_percent" {
  description = "Upper limit of the number of running tasks running during deployment, e.g. 200"
  type        = number
}

variable "deployment_minimum_healthy_percent" {
  description = "Lower limit of the number of running tasks running during deployment, e.g. 100"
  type        = number
}

variable "desired_count" {
  description = "ECS task definition instance number"
  type        = number
}

variable "container_memory" {
  description = "ECS task container memory, e.g. 900"
  type        = number
}

variable "aws_cloudwatch_log_group_name" {
  description = "AWS CloudWatch Log Group name"
  type        = string
}

variable "environment_variables" {
  description = "List of [{name = \"\", value = \"\"}] pairs of environment variables"
  type = set(object({
    name  = string
    value = string
  }))
}

variable "secrets_variables" {
  description = "List of [{name = \"\", valueFrom = \"\"}] pairs of secret variables"
  type        = list(any)
}

variable "secrets_arns" {
  description = "The ARNs of the SSM Parameter Store parameters"
  type        = list(string)
}

variable "min_instance_count" {
  description = "Autoscaling minimum instance count"
  type        = number
}

variable "max_instance_count" {
  description = "Autoscaling maximum instance count"
  type        = number
}

variable "autoscaling_target_cpu_percentage" {
  description = "Autoscaling target CPU percentage"
  type        = number
}

variable "autoscaling_target_memory_percentage" {
  description = "Autoscaling target memory percentage"
  type        = number
}
