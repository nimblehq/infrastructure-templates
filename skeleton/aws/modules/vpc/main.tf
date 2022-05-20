data "aws_availability_zones" "available" {}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.0.0"

  name                   = "${var.namespace}-vpc"
  cidr                   = var.cidr
  azs                    = data.aws_availability_zones.available.names
  private_subnets        = var.private_subnet_cidrs
  public_subnets         = var.public_subnet_cidrs
  enable_nat_gateway     = var.enable_nat_gateway
  single_nat_gateway     = var.single_nat_gateway
  one_nat_gateway_per_az = var.one_nat_gateway_per_az
  enable_dns_hostnames   = var.enable_dns_hostnames

  tags = {
    Owner       = var.owner
    Environment = var.environment
  }
}
