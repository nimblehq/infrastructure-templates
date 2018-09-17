data "vault_generic_secret" "mysql" {
  path = "secret-v1/hadex/db/mysql/init"
}

module "db_mysql" {
  source = "terraform-aws-modules/rds/aws"

  identifier = "${var.rds_mysql_identifier}"

  engine            = "${var.rds_mysql_engine}"
  engine_version    = "${var.rds_mysql_engine_version}"
  instance_class    = "${var.rds_mysql_instance_type}"
  allocated_storage = "${var.rds_mysql_allocated_storage}"
  storage_encrypted = "${var.rds_mysql_storage_encrypted}"

  # kms_key_id        = "arm:aws:kms:<region>:<account id>:key/<kms key id>"
  name = "${var.rds_mysql_name}"

  # NOTE: Do NOT use 'user' as the value for 'username' as it throws:
  # "Error creating DB Instance: InvalidParameterValue: MasterUsername
  # user cannot be used as it is a reserved word used by the engine"
  username = "${data.vault_generic_secret.mysql.data["username"]}"
  password = "${data.vault_generic_secret.mysql.data["password"]}"
  port     = "${var.rds_mysql_port}"

  vpc_security_group_ids = ["${module.security_group.this_security_group_id}"]

  maintenance_window = "${var.rds_mysql_maintenance_window}"
  backup_window      = "${var.rds_mysql_backup_window}"

  # disable backups to create DB faster
  backup_retention_period = "${var.rds_mysql_backup_retention_period}"

  # DB subnet group name
  db_subnet_group_name      = "${aws_db_subnet_group.db_subnet.name}"

  # DB parameter group
  family = "${var.rds_mysql_family}"

  # DB option group
  major_engine_version = "${var.rds_mysql_major_engine_version}"

  # Snapshot name upon DB deletion
  final_snapshot_identifier = "${var.rds_mysql_final_snapshot_identifier}"
}