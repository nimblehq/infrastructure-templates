module "security_group" {
  source = "terraform-aws-modules/security-group/aws"

  name        = "hadex-sec-group"
  description = "Security group for Hadex usage with EC2 instance"
  vpc_id = "${module.hadex_vpc.vpc_id}"

  ingress_cidr_blocks = ["0.0.0.0/0"]
  # TODO: disable ssh & icmp later
  ingress_rules       = ["ssh-tcp","http-80-tcp", "all-icmp"]
  egress_rules        = ["all-all"]
}

# IAM configuration
resource "aws_iam_role" "ec2-instance-role" {
  name = "ec2-instance-role"
  path = "/"
  assume_role_policy = "${data.aws_iam_policy_document.ec2-instance-policy.json}"
}

data "aws_iam_policy_document" "ec2-instance-policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_instance_profile" "ec2-instance-profile" {
  name = "ec2-instance-profile"
  path = "/"
  role = "${aws_iam_role.ec2-instance-role.id}"
  provisioner "local-exec" {
    command = "sleep 60"
  }
}

resource "aws_iam_role_policy_attachment" "ec2-instance-role-attachment" {
  role = "${aws_iam_role.ec2-instance-role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

# For RDS

module "security_group_rds" {
  source = "terraform-aws-modules/security-group/aws"

  name        = "hadex-rds-sec-group"
  description = "Security group for Hadex usage with RDS instances"
  vpc_id = "${module.hadex_vpc.vpc_id}"

  ingress_cidr_blocks = ["0.0.0.0/0"]
  # TODO: disable ssh & icmp later
  ingress_rules       = ["mysql-tcp"]
  egress_rules        = ["all-all"]
}

#Create a RDS security group in the VPC which our database will belong to:
resource "aws_security_group" "rds" {
  name        = "${var.rds_sec_group_name}"
  description = "Hadex sec group for RDS servers"
  vpc_id      = "${module.hadex_vpc.vpc_id}"
  # Keep the instance private by only allowing traffic from the web server.
  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = ["${module.security_group_rds.this_security_group_id}"]
  }
  # Allow all outbound traffic.
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags {
    Name = "${var.rds_sec_group_name}"
  }
}