data "aws_ecr_repository" "repo" {
  name = var.ecr_repo_name
}

locals {
  # Environment variables from other variables
  environment_variables = toset([
    {
      name  = "AWS_REGION"
      value = var.region
    }
  ])

  container_vars = {
    namespace                          = var.namespace
    region                             = var.region
    app_host                           = var.app_host
    app_port                           = var.app_port
    cpu                                = var.cpu
    memory                             = var.container_memory
    deployment_maximum_percent         = var.deployment_maximum_percent
    deployment_minimum_healthy_percent = var.deployment_minimum_healthy_percent
    aws_ecr_repository                 = data.aws_ecr_repository.repo.repository_url
    aws_ecr_tag                        = var.ecr_tag
    aws_cloudwatch_log_group_name      = var.aws_cloudwatch_log_group_name

    environment_variables = setunion(local.environment_variables, var.environment_variables)
    secrets_variables     = var.secrets_variables
  }

  container_definitions = templatefile("${path.module}/service.json.tftpl", local.container_vars)

  ecs_task_execution_assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Action    = "sts:AssumeRole"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  ecs_task_execution_ssm_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ssm:GetParameters"
        ],
        Resource = var.secrets_arns
      }
    ]
  })

  # Required IAM permissions from
  # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html#auto-scaling-IAM
  ecs_service_scaling_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "application-autoscaling:*",
          "ecs:DescribeServices",
          "ecs:UpdateService",
          "cloudwatch:DescribeAlarms",
          "cloudwatch:PutMetricAlarm",
          "cloudwatch:DeleteAlarms",
          "cloudwatch:DescribeAlarmHistory",
          "cloudwatch:DescribeAlarmsForMetric",
          "cloudwatch:GetMetricStatistics",
          "cloudwatch:ListMetrics",
          "cloudwatch:DisableAlarmActions",
          "cloudwatch:EnableAlarmActions",
          "iam:CreateServiceLinkedRole",
          "sns:CreateTopic",
          "sns:Subscribe",
          "sns:Get*",
          "sns:List*"
        ],
        Resource = "*"
      }
    ]
  })
}

# Current task definition on AWS including deployments outside terraform (e.g. CI deployments)
data "aws_ecs_task_definition" "task" {
  task_definition = aws_ecs_task_definition.main.family
}

resource "aws_iam_policy" "ecs_task_execution_ssm" {
  name   = "${var.namespace}-ECSTaskExecutionAccessSSMPolicy"
  policy = local.ecs_task_execution_ssm_policy
}

# tfsec:ignore:aws-iam-no-policy-wildcards
resource "aws_iam_policy" "ecs_task_excution_service_scaling" {
  name   = "${var.namespace}-ECSAutoScalingPolicy"
  policy = local.ecs_service_scaling_policy
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${var.namespace}-ecs-execution-role"
  assume_role_policy = local.ecs_task_execution_assume_role_policy
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_ssm_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_task_execution_ssm.arn
}

resource "aws_iam_role_policy_attachment" "ecs_task_excution_service_scaling_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_task_excution_service_scaling.arn
}

resource "aws_ecs_cluster" "main" {
  name = "${var.namespace}-ecs-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_task_definition" "main" {
  family                   = "${var.namespace}-service"
  cpu                      = var.cpu
  memory                   = var.memory
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions    = local.container_definitions
  requires_compatibilities = ["FARGATE"]
}

resource "aws_ecs_service" "main" {
  name                               = "${var.namespace}-ecs-service"
  cluster                            = aws_ecs_cluster.main.id
  launch_type                        = "FARGATE"
  deployment_maximum_percent         = var.deployment_maximum_percent
  deployment_minimum_healthy_percent = var.deployment_minimum_healthy_percent
  desired_count                      = var.desired_count
  task_definition                    = "${aws_ecs_task_definition.main.family}:${max("${aws_ecs_task_definition.main.revision}", "${data.aws_ecs_task_definition.task.revision}")}"

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    subnets         = var.subnets
    security_groups = var.security_groups
  }

  load_balancer {
    target_group_arn = var.alb_target_group_arn
    container_name   = var.namespace
    container_port   = var.app_port
  }

  # Allow external changes without Terraform plan to the desired_count as it can be changed by Autoscaling
  lifecycle {
    ignore_changes = [desired_count]
  }
}

resource "aws_appautoscaling_target" "main" {
  max_capacity       = var.max_instance_count
  min_capacity       = var.min_instance_count
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.main.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "memory_policy" {
  name               = "${var.namespace}-appautoscaling-memory-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.main.resource_id
  scalable_dimension = aws_appautoscaling_target.main.scalable_dimension
  service_namespace  = aws_appautoscaling_target.main.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }

    scale_in_cooldown  = var.scale_in_cooldown_period
    scale_out_cooldown = var.scale_out_cooldown_period

    target_value = var.autoscaling_target_memory_percentage
  }
}

resource "aws_appautoscaling_policy" "cpu_policy" {
  name               = "${var.namespace}-appautoscaling-cpu-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.main.resource_id
  scalable_dimension = aws_appautoscaling_target.main.scalable_dimension
  service_namespace  = aws_appautoscaling_target.main.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    scale_in_cooldown  = var.scale_in_cooldown_period
    scale_out_cooldown = var.scale_out_cooldown_period

    target_value = var.autoscaling_target_cpu_percentage
  }
}
