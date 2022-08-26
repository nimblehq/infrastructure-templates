variable "namespace" {
  description = "The namespace for the DB"
  type        = string
}

variable "engine" {
  description = "The Aurora DB Engine"
  type        = string
  default     = "aurora-postgresql"
}

variable "engine_version" {
  description = "The Aurora PostgreSQL DB Engine version"
  type        = string
  default     = "14.3"
}

variable "instance_type" {
  description = "The Aurora DB instance type, e.g. 'db.t3.medium'"
  type        = string
}

variable "vpc_security_group_ids" {
  description = "A list of security group IDs to assign to the DB"
  type        = list(string)
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "database_name" {
  description = "The DB name, e.g. 'acme_web_staging_db'"
  type        = string
}

variable "username" {
  description = "The DB master username: 1–16 alphanumeric characters and underscores, first character must be a letter, can't be a word reserved by the database engine."
  type        = string
}

variable "password" {
  description = "RDS password. Some special chars might result in a wrong encoding of the DATABASE_URL."
  type        = string
}

variable "port" {
  description = "The DB port"
  default     = 5432
}

variable "subnet_ids" {
  description = "A list of subnet IDs for DB subnet group"
  type        = list(string)
}

variable "autoscaling_min_capacity" {
  description = "Minimum number of RDS read replicas when autoscaling is enabled (0 or more)"
  default     = 0
}

variable "autoscaling_max_capacity" {
  description = "Maximum number of read replicas when autoscaling is enabled (0 or more, 5 recommended)"
  default     = 0
}

variable "create_monitoring_role" {
  description = "A flag whether to create the IAM role for monitoring"
  type        = bool
  default     = false
}

variable "cloudwatch_logs_exports" {
  description = "A list of log types to export to CloudWatch"
  type        = list(string)
  default     = ["postgresql"]
}
