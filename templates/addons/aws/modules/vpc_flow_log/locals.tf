locals {
  ordered_partition_keys = [
    { key = "aws_account_id", value = "string" },
    { key = "aws_service", value = "string" },
    { key = "aws_region", value = "string" },
    { key = "year", value = "string" },
    { key = "month", value = "string" },
    { key = "day", value = "string" },
    { key = "hour", value = "string" }
  ]

  //https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html#flow-logs-fields
  ordered_table_columns = [
    { key = "version", value = "int" },
    { key = "account_id", value = "string" },
    { key = "action", value = "string" },
    { key = "interface_id", value = "string" },
    { key = "srcaddr", value = "string" },
    { key = "dstaddr", value = "string" },
    { key = "srcport", value = "int" },
    { key = "dstport", value = "int" },
    { key = "protocol", value = "int" },
    { key = "packets", value = "bigint" },
    { key = "bytes", value = "bigint" },
    { key = "start", value = "bigint" },
    { key = "end", value = "bigint" },
    { key = "log_status", value = "string" },
    { key = "vpc_id", value = "string" },
    { key = "subnet_id", value = "string" },
    { key = "instance_id", value = "string" },
    { key = "tcp_flags", value = "int" },
    { key = "type", value = "string" },
    { key = "pkt_srcaddr", value = "string" },
    { key = "pkt_dstaddr", value = "string" },
    { key = "region", value = "string" },
    { key = "az_id", value = "string" },
    { key = "sublocation_type", value = "string" },
    { key = "sublocation_id", value = "string" },
    { key = "pkt_src_aws_service", value = "string" },
    { key = "pkt_dst_aws_service", value = "string" },
    { key = "flow_direction", value = "string" },
    { key = "traffic_path", value = "int" },
    { key = "ecs_task_id", value = "string" },
    { key = "reject_reason", value = "string" },
  ]

  log_format = join(
    " ",
    [
      for col in local.ordered_table_columns :
      "$${${replace(col.key, "_", "-")}}"
    ]
  )
}
