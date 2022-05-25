resource "aws_ssm_parameter" "secret_key_base" {
  name  = "/${var.namespace}/SECRET_KEY_BASE"
  type  = "String"
  value = var.secret_key_base
}

resource "aws_ssm_parameter" "database_url" {
  name  = "/${var.namespace}/DATABASE_URL"
  type  = "String"
  value = "postgresql://${var.rds_username}:${var.rds_password}@${var.rds_endpoint}/${var.rds_database_name}"
}

resource "aws_ssm_parameter" "aws_access_key_id" {
  name  = "/${var.namespace}/AWS_ACCESS_KEY_ID"
  type  = "String"
  value = var.aws_access_key_id
}

resource "aws_ssm_parameter" "aws_secret_access_key" {
  name  = "/${var.namespace}/AWS_SECRET_ACCESS_KEY"
  type  = "String"
  value = var.aws_secret_access_key
}
