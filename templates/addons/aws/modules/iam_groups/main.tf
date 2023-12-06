#tfsec:ignore:aws-iam-enforce-group-mfa
resource "aws_iam_group" "admin" {
  name = "Admin-group"
}

#tfsec:ignore:aws-iam-enforce-group-mfa
resource "aws_iam_group" "infra-service-account" {
  name = "Infra-service-account-group"
}

#tfsec:ignore:aws-iam-enforce-group-mfa
resource "aws_iam_group" "developer" {
  name = "Developer-group"
}

resource "aws_iam_group_policy_attachment" "admin_access" {
  group      = aws_iam_group.admin.name
  policy_arn = data.aws_iam_policy.admin_access.arn
}

# Policy from https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_aws_my-sec-creds-self-manage.html
# tfsec:ignore:aws-iam-no-policy-wildcards
resource "aws_iam_group_policy" "developer_allow_manage_own_credentials" {
  group  = aws_iam_group.developer.name
  policy = local.allow_manage_own_credentials
}

resource "aws_iam_group_policy_attachment" "developer_power_user_access" {
  group      = aws_iam_group.developer.name
  policy_arn = data.aws_iam_policy.power_user_access.arn
}

resource "aws_iam_group_policy_attachment" "infra_service_account_power_user_access" {
  group      = aws_iam_group.infra-service-account.name
  policy_arn = data.aws_iam_policy.power_user_access.arn
}

# This IAM policy is needed for the infra-service-account account to manage IAM users & groups
# tfsec:ignore:aws-iam-no-policy-wildcards
resource "aws_iam_group_policy" "infra_service_account_full_iam_access" {
  name   = "AllowFullIamAccess"
  group  = aws_iam_group.infra-service-account.name
  policy = local.full_iam_access_policy
}
