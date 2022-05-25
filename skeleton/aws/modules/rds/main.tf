module "db" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "6.2.0"

  name = "${var.namespace}-aurora-db"

  engine         = var.engine
  engine_version = var.engine_version

  vpc_id                 = var.vpc_id
  subnets                = var.subnet_ids
  vpc_security_group_ids = var.vpc_security_group_ids

  instance_class = var.instance_type
  instances = {
    main = {}
  }

  autoscaling_enabled      = true
  autoscaling_min_capacity = var.autoscaling_min_capacity
  autoscaling_max_capacity = var.autoscaling_max_capacity

  create_monitoring_role = var.create_monitoring_role
  create_random_password = false
  create_security_group  = false
  storage_encrypted      = true

  publicly_accessible = false

  database_name       = var.database_name
  master_username     = var.username
  master_password     = var.password
  port                = var.port
  deletion_protection = true

  enabled_cloudwatch_logs_exports = var.cloudwatch_logs_exports
}
