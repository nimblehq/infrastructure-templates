data "aws_availability_zones" "available" {}

# trivy:ignore:AVD-AWS-0178 trivy:ignore:AVD-AWS-0164
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.0.0"

  name                   = "${var.env_namespace}-vpc"
  cidr                   = "10.0.0.0/16"
  azs                    = data.aws_availability_zones.available.names
  private_subnets        = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets         = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
  enable_nat_gateway     = true
  single_nat_gateway     = true
  one_nat_gateway_per_az = false
  enable_dns_hostnames   = true
}

data "aws_route_tables" "private_route_table" {
  vpc_id = module.vpc.vpc_id

  filter {
    name   = "tag:Name"
    values = ["${var.env_namespace}-vpc-private"]
  }
}

resource "aws_vpc_endpoint" "logs" {
  vpc_id          = module.vpc.vpc_id
  service_name    = "com.amazonaws.${var.region}.logs"
  route_table_ids = data.aws_route_tables.private_route_table.ids

  tags = {
    Name = "${var.env_namespace}-vpc-endpoint-logs"
  }
}
