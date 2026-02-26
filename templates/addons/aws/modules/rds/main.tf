module "db" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "10.2.0"

  name = local.name

  engine         = "aurora-postgresql"
  engine_version = local.engine_version

  vpc_id                 = var.vpc_id
  subnets                = var.subnet_ids
  vpc_security_group_ids = var.vpc_security_group_ids

  create_db_subnet_group = true
  db_subnet_group_name   = local.subnet_name

  cluster_instance_class = var.instance_type
  instances = {
    master = {
      instance_type       = var.instance_type
      identifier          = local.master_instance_identifier
      publicly_accessible = var.publicly_accessible
    }
  }

  autoscaling_enabled      = true
  autoscaling_min_capacity = var.autoscaling_min_capacity
  autoscaling_max_capacity = var.autoscaling_max_capacity

  create_monitoring_role = false
  create_security_group  = false
  storage_encrypted      = true

  // Set false to manual provide password and save it to SSM secret parameter store 
  manage_master_user_password = false
  master_username             = var.username
  master_password_wo          = var.password
  master_password_wo_version  = var.password_version
  database_name               = var.database_name

  port                            = local.db_port
  deletion_protection             = local.deletion_protection
  enabled_cloudwatch_logs_exports = local.logs_exports
}
