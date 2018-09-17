data "aws_availability_zones" "all" { }

# VPC, Security group configuration
module "hadex_vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "hadex-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["ap-southeast-1", "ap-southeast-2", "ap-southeast-3"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24", "10.0.4.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24", "10.0.104.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = true

  tags = {
    Terraform = "true"
  }
}

resource "aws_subnet" "rds" {
  vpc_id                  = "${module.hadex_vpc.vpc_id}"
  cidr_block              = "10.0.4.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${element(data.aws_availability_zones.all.names, count.index)}"
  tags {
    Name = "rds-${element(data.aws_availability_zones.all.names, count.index)}"
  }
}

resource "aws_db_subnet_group" "db_subnet" {
  name        = "${var.rds_instance_identifier}-subnet-group"
  subnet_ids  = ["${aws_subnet.rds.*.id}"]
}

# Create an internet gateway to give our subnet access to the outside world
resource "aws_internet_gateway" "gateway" {
  vpc_id = "${module.hadex_vpc.vpc_id}"

  tags {
    Name = "hadex-terraform-internet-gateway"
  }
}

# Grant the VPC internet access on its main route table
resource "aws_route" "route" {
  route_table_id         = "${module.hadex_vpc.vpc_main_route_table_id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = "${aws_internet_gateway.gateway.id}"
}

### Creating ALB 
resource "aws_lb" "hadex-alb" {
  name      = "terraform-hadex-alb"
  internal  = false
  load_balancer_type = "application"
  security_groups = ["${module.security_group.this_security_group_id}"]
  subnets            = ["${module.hadex_vpc.public_subnets}"]
  enable_deletion_protection = true
}