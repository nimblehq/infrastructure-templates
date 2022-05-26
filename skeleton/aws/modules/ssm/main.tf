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
