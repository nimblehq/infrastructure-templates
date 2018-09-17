provider "vault" {}

resource "vault_aws_secret_backend_role" "producer" {
  backend = "aws"
  name    = "${terraform.workspace == "staging" ? var.name_staging : var.name }"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iam:*", "ec2:*", "s3:*"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}
