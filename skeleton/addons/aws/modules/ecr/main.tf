# tfsec:ignore:aws-ecr-enforce-immutable-repository tfsec:ignore:aws-ecr-repository-customer-key
resource "aws_ecr_repository" "main" {
  name = var.namespace

  image_scanning_configuration {
    scan_on_push = true
  }
}

locals {
  primary_prefixes   = ["develop", "main"]
  secondary_prefixes = ["bug", "chore", "feature"]

  all_prefixes = concat(local.primary_prefixes, local.secondary_prefixes)

  primary_image_rules = [
    for branch_prefix in local.primary_prefixes :
    {
      rulePriority = index(local.all_prefixes, branch_prefix) + 1
      description  = "Keep only ${var.image_limit} latest ${branch_prefix} images"
      selection = {
        countType     = "imageCountMoreThan"
        countNumber   = var.image_limit
        tagStatus     = "tagged"
        tagPrefixList = ["${branch_prefix}-"]
      }
      action = {
        type = "expire"
      }
    }
  ]

  secondary_image_rules = [
    for branch_prefix in local.secondary_prefixes :
    {
      rulePriority = index(local.all_prefixes, branch_prefix) + 1
      description  = "Keep only 1 latest ${branch_prefix} image"
      selection = {
        countType     = "imageCountMoreThan"
        countNumber   = 1
        tagStatus     = "tagged"
        tagPrefixList = ["${branch_prefix}-"]
      }
      action = {
        type = "expire"
      }
    }
  ]

  untagged_image_rule = [{
    rulePriority = length(local.all_prefixes) + 1,
    description  = "Delete untagged images after 1 day"
    selection = {
      countType   = "sinceImagePushed"
      countNumber = 1
      tagStatus   = "untagged"
      countUnit   = "days"
    }
    action = {
      type = "expire"
    }
  }]
}

resource "aws_ecr_lifecycle_policy" "main_policy" {
  repository = aws_ecr_repository.main.name

  policy = jsonencode({
    rules = concat(local.primary_image_rules, local.secondary_image_rules, local.untagged_image_rule)
  })
}
