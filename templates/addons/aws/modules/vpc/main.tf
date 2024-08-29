data "aws_availability_zones" "available" {}

# trivy:ignore:AVD-AWS-0178 trivy:ignore:AVD-AWS-0164
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.13.0"

  name                   = "${var.env_namespace}-vpc"
  cidr                   = local.cidr
  azs                    = data.aws_availability_zones.available.names
  private_subnets        = local.private_subnets
  public_subnets         = local.public_subnets
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

resource "aws_security_group" "vpc_endpoints" {
  name_prefix = "${var.env_namespace}-vpc-endpoints"
  description = "Associated to ECR/s3 VPC Endpoints"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "Allow Nodes to pull images from ECR via VPC endpoints"
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = local.private_subnets
  }
}

# allow ECS to connect to S3 via VPC Endpoint instead of NAT Gateway
resource "aws_vpc_endpoint" "s3" {
  vpc_id          = module.vpc.vpc_id
  service_name    = "com.amazonaws.${var.region}.s3"
  route_table_ids = data.aws_route_tables.private_route_table.ids

  tags = {
    Name = "${var.env_namespace}-vpc-endpoint-s3"
  }
}

# allow ECS to push logs to cloudwatch via VPC Endpoint instead of NAT Gateway
resource "aws_vpc_endpoint" "logs" {
  vpc_id              = module.vpc.vpc_id
  service_name        = "com.amazonaws.${var.region}.logs"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  security_group_ids = [aws_security_group.vpc_endpoints.id]
  subnet_ids         = module.vpc.private_subnets

  tags = {
    Name = "${var.env_namespace}-vpc-endpoint-logs"
  }
}

# allow ECS to pull/push images to ECR DKR via VPC Endpoint instead of NAT Gateway
resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id              = module.vpc.vpc_id
  service_name        = "com.amazonaws.${var.region}.ecr.dkr"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  security_group_ids = [aws_security_group.vpc_endpoints.id]
  subnet_ids         = module.vpc.private_subnets

  tags = {
    Name = "${var.env_namespace}-vpc-endpoint-ecr-dkr"
  }
}

# allow ECS to pull/push images to ECR API via VPC Endpoint instead of NAT Gateway
resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id              = module.vpc.vpc_id
  service_name        = "com.amazonaws.${var.region}.ecr.api"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  security_group_ids = [aws_security_group.vpc_endpoints.id]
  subnet_ids         = module.vpc.private_subnets

  tags = {
    Name = "${var.env_namespace}-vpc-endpoint-ecr-api"
  }
}
