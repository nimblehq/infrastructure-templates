locals {
  name                       = "${var.env_namespace}-aurora-db"
  subnet_name                = "${local.name}-subnet-group"
  engine_version             = 17.7
  master_instance_identifier = "${var.env_namespace}-aurora-instance-master"
  db_port                    = 5432
  logs_exports               = ["postgresql"]
  deletion_protection        = true
}
