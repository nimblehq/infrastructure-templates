output "parameter_store" {
  description = "ARNs of the parameters"

  value = {
    secret_base_ssm_arn           = aws_ssm_parameter.secret_key_base.arn
    database_url_ssm_arn          = aws_ssm_parameter.database_url.arn
    aws_access_key_id_ssm_arn     = aws_ssm_parameter.aws_access_key_id.arn
    aws_secret_access_key_ssm_arn = aws_ssm_parameter.aws_secret_access_key.arn
  }
}
