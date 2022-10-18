resource "aws_ssm_parameter" "secret_parameters" {
  for_each = var.secrets

  name  = "/${var.namespace}/${each.key}"
  type  = "String"
  value = each.value
}

locals {
  # Create a list of parameter store ARNs for granting access to ECS task execution role
  parameter_store_arns = [for parameter in aws_ssm_parameter.secret_parameters : parameter.arn]

  # Get secret names array
  secret_names = keys(var.secrets)

  # Create a map {secret_name: secret_arn} using zipmap function for iteration
  secret_arns = zipmap(local.secret_names, local.parameter_store_arns)

  # Create the formatted secrets for ECS task definition
  secrets_variables = [for secret_key, secret_arn in local.secrets_name_arn_map :
    tomap({ "name" = upper(secret_key), "valueFrom" = secret_arn })
  ]
}
