data "aws_ecr_repository" "repo" {
  name = var.ecr_repo_name
}

locals {
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

    health_check_path           = var.container_envs.health_check_path
    environment                 = var.container_envs.environment
    verification_subdomain      = var.container_envs.verification_subdomain
    deeplink_email_verification = var.container_envs.deeplink_email_verification

    mailgun_domain                        = var.container_envs.mailgun_domain
    mailgun_template_account_verification = var.container_envs.mailgun_template.account_verification
    mailer_sender_email                   = var.container_envs.mailer_sender_email
    mailer_sender_name                    = var.container_envs.mailer_sender_name

    token_ttl_auth_code      = var.container_envs.token_ttl.auth_code
    token_ttl_client_access  = var.container_envs.token_ttl.client_access
    token_ttl_client_refresh = var.container_envs.token_ttl.client_refresh
    token_ttl_user_access    = var.container_envs.token_ttl.user_access
    token_ttl_user_refresh   = var.container_envs.token_ttl.user_refresh

    aws_sns_sender_id = var.container_envs.aws_sns_sender_id
  }

  container_definitions = templatefile("${path.module}/service.json.tftpl", merge(local.container_vars, var.aws_parameter_store))

  ecs_task_execution_ssm_policy = {
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ssm:GetParameters"
        ],
        Resource = "*"
      }
    ]
  }
}

data "aws_iam_policy_document" "ecs_task_execution_role" {
  version = "2012-10-17"
  statement {
    sid     = ""
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "ecs_task_execution_ssm" {
  policy = jsonencode(local.ecs_task_execution_ssm_policy)
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${var.namespace}-ecs-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_role.json
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_ssm_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_task_execution_ssm.arn
}

resource "aws_ecs_cluster" "main" {
  name = "${var.namespace}-ecs-cluster"
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
  task_definition                    = aws_ecs_task_definition.main.arn

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
}
