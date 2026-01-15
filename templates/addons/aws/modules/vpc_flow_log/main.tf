# VPC Flow Log
resource "aws_flow_log" "vpc_flow_log" {
  log_destination      = "arn:aws:s3:::${var.s3_bucket_name}"
  log_destination_type = "s3"
  traffic_type         = "ALL"
  vpc_id               = var.vpc_id
  log_format           = local.log_format
  // Does NOT need IAM role here since s3 bucket policy handles the permissions

  //Use Parquet format for better compression and cost efficiency when query with Athena
  destination_options {
    file_format                = "parquet"
    hive_compatible_partitions = true
    per_hour_partition         = true
  }
}

// Lifecycle policy to expire objects in the S3 bucket
resource "aws_s3_bucket_lifecycle_configuration" "flow_log_lifecycle" {
  bucket = var.s3_bucket_name

  rule {
    id     = "ExpireFlowLogs"
    status = "Enabled"

    filter {
      prefix = "" # Apply to all objects
    }

    expiration {
      days = var.log_retention_days
    }
  }
}

// Athena table for VPC Flow Logs
// Athena charges based on the amount of data scanned per query (not for table creation).
// Using the Parquet format helps minimize scanned data, which reduces query costs.
// https://www.amazonaws.cn/en/athena/pricing/
resource "aws_athena_workgroup" "vpc_flow_log_athena_workgroup" {
  name = "${var.env_namespace}-vpc-flow-logs"

  configuration {
    enforce_workgroup_configuration    = true
    publish_cloudwatch_metrics_enabled = true

    result_configuration {
      output_location = "s3://${var.s3_bucket_name}/athena-results/"
      encryption_configuration {
        encryption_option = "SSE_S3"
      }
    }
  }
}

resource "aws_glue_catalog_database" "vpc_flow_log_database" {
  name        = "${var.env_namespace}-athena-vpc-flow-log-db"
  description = "Athena database for VPC ${var.vpc_id} Flow Logs in ${var.env_namespace}"
}

resource "aws_glue_catalog_table" "vpc_flow_log_table" {
  name          = "${var.env_namespace}-athena-vpc-flow-log-table"
  database_name = aws_glue_catalog_database.vpc_flow_log_database.name
  description   = "VPC ${var.vpc_id} Flow Logs Table in ${var.env_namespace}"
  table_type    = "EXTERNAL_TABLE"

  storage_descriptor {
    location      = "s3://${var.s3_bucket_name}/AWSLogs/"
    input_format  = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat"
    output_format = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat"

    ser_de_info {
      parameters = {
        "serialization.format" = "1"
      }
      serialization_library = "org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe"
    }

    dynamic "columns" {
      for_each = local.ordered_table_columns
      content {
        name = columns.value.key
        type = columns.value.value
      }
    }
  }

  dynamic "partition_keys" {
    for_each = local.ordered_partition_keys
    content {
      name = partition_keys.value.key
      type = partition_keys.value.value
    }
  }

  parameters = {
    EXTERNAL                           = "TRUE"
    "parquet.compression"              = "SNAPPY"
    "skip.header.line.count"           = "1"
    "projection.enabled"               = "true"
    "projection.aws_account_id.type"   = "integer"
    "projection.aws_account_id.digits" = "12"
    "projection.aws_account_id.range"  = "000000000001,999999999999"
    "projection.aws_service.type"      = "enum"
    "projection.aws_service.values"    = "vpcflowlogs"
    "projection.aws_region.type"       = "enum"
    "projection.aws_region.values"     = "${data.aws_region.current.region}"
    "projection.year.type"             = "integer"
    "projection.year.range"            = "2025,2030" # Update the range as needed
    "projection.year.digits"           = "4"
    "projection.month.type"            = "integer"
    "projection.month.range"           = "01,12"
    "projection.month.digits"          = "2"
    "projection.day.type"              = "integer"
    "projection.day.range"             = "01,31"
    "projection.day.digits"            = "2"
    "projection.hour.type"             = "integer"
    "projection.hour.range"            = "00,23"
    "projection.hour.digits"           = "2"
    "storage.location.template"        = "s3://${var.s3_bucket_name}/AWSLogs/aws-account-id=$${aws_account_id}/aws-service=$${aws_service}/aws-region=$${aws_region}/year=$${year}/month=$${month}/day=$${day}/hour=$${hour}/"
  }
}
