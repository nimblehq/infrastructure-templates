locals {
  # Comes from https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#access-keys_required-permissions
  allow_manage_own_access_key_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "ManageOwnAccessKeys"
        Effect    = "Allow"
        Action    = [
          "iam:CreateAccessKey",
          "iam:DeleteAccessKey",
          "iam:GetAccessKeyLastUsed",
          "iam:GetUser",
          "iam:ListAccessKeys",
          "iam:UpdateAccessKey"
        ]
        Resource  = ["arn:aws:iam::*:user/${aws:username}"]
      }
    ]
  })

  # Comes from docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_aws_my-sec-creds-self-manage-mfa-only.html
  # We need to remove DenyAllExceptListedIfNoMFA to allow users to change their password on first time login when no MFA is created
  allow_manage_own_mfa_policy = jsonencode({
    version = "2012-10-17"
    statement = [
      {
        sid       = "AllowViewAccountInfo"
        effect    = "Allow"
        resources = ["*"]
        actions   = ["iam:ListVirtualMFADevices"]
      },
      {
        sid       = "AllowManageOwnVirtualMFADevice"
        effect    = "Allow"
        resources = ["arn:aws:iam::*:mfa/*"]
        actions   = [
          "iam:CreateVirtualMFADevice",
          "iam:DeleteVirtualMFADevice"
        ]
      },
      {
        sid       = "AllowManageOwnUserMFA"
        effect    = "Allow"
        resources = ["arn:aws:iam::*:user/${aws:username}"]
        actions   = [
          "iam:DeactivateMFADevice",
          "iam:EnableMFADevice",
          "iam:GetUser",
          "iam:ListMFADevices",
          "iam:ResyncMFADevice"
        ]
      }
    ]
  })

  # For the bot account
  # It must be able to manage policies during terraform apply & create/delete users, permissions, etc. during terraform apply
  full_iam_access_policy = jsonencode({
    version = "2012-10-17"
    statement = [      
      {        
        sid       = "AllowManageRoleAndPolicy"        
        effect    = "Allow"        
        resources = ["arn:aws:iam::*"]
        actions   = ["iam:*"]
      }
    ]
  })
}

data "aws_iam_policy" "admin_access" {
  arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

data "aws_iam_policy" "s3_full_access" {
  arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

data "aws_iam_policy" "power_user_access" {
  arn = "arn:aws:iam::aws:policy/PowerUserAccess"
}
