variable "name" { 
  default = "hadex-terraform-instance" 
}

variable "ttl"  { 
  default = "1" 
}

variable "hadex_s3_bucket" {
  description = "S3 bucket for the Production application"
  default = "com.hadex.app-bucket"
}

variable "hadex_s3_bucket_staging" {
  description = "S3 bucket for the Staging application"
  default = "com.hadex.app-bucket-staging"
}

variable "region" {
  description = "AWS Region"
  default = "ap-southeast-1"
}

variable "ami_type" {
  description = "ID of the AMI to provision. Default is Amazon Linux AMI 2018.03.0 (HVM), SSD Volume Type"
  default = "ami-03221428e6676db69"
}

variable "instance_type" {
  description = "type of EC2 instance to provision. (Ubuntu)"
  default = "t2.micro"
}

variable "rds_instance_identifier" {
  description = "RDS Instance Identifier"
  default = "terraform-rds"
}

variable "rds_sec_group_name" {
  default = "hadex_rds_security_group"
}

# RDS MySQL
variable "rds_mysql_identifier" { default = "hadexmysql" }
variable "rds_mysql_engine" { default = "mysql" }
variable "rds_mysql_engine_version" { default = "5.7.22" }
variable "rds_mysql_instance_type" { default = "db.t2.micro" }
variable "rds_mysql_allocated_storage" { default = 20 }
variable "rds_mysql_storage_encrypted" { default = false }
variable "rds_mysql_name" { default = "hadexmysql" }
variable "rds_mysql_port" { default = "3306" }
variable "rds_mysql_maintenance_window" { default = "Mon:00:00-Mon:03:00" }
variable "rds_mysql_backup_window" { default = "03:00-06:00" }
variable "rds_mysql_backup_retention_period" { default = 0 }
variable "rds_mysql_family" { default = "mysql-5-7" }
variable "rds_mysql_major_engine_version" { default = "5.7" }
variable "rds_mysql_final_snapshot_identifier" { default = "hadexmysqldb" }