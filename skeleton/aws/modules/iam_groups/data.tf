locals {
  # Comes from https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_aws_my-sec-creds-self-manage.html
  # Users can view and edit their own passwords, access keys, MFA devices, X.509 certificates, and SSH keys and Git credentials
  # It also requires the user to set up and authenticate using MFA before performing any other operations in AWS
  # This example policy does not allow users to reset a password while signing in to the AWS Management Console for the first time.
  # They must set their MFA first
  # 
  # The following actions are added to the initial policy from AWS
  # - iam:GetLoginProfile: allow the IAM user viewing their account info on security page
  # - iam:GetAccessKeyLastUsed: allow the IAM user viewing their access key's last used
  allow_manage_own_credentials = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid = "AllowViewAccountInfo"
        Effect = "Allow"
        Action = [
          "iam:GetAccountPasswordPolicy",
          "iam:ListVirtualMFADevices",
          "iam:GetLoginProfile"
        ]
        Resource = "*"
      },
      {
        Sid = "AllowManageOwnPasswords"
        Effect = "Allow"
        Action = [
          "iam:ChangePassword",
          "iam:GetUser"
        ]
        Resource = "arn:aws:iam::*:user/${aws:username}"
      },
      {
        Sid = "AllowManageOwnAccessKeys"
        Effect = "Allow"
        Action = [
          "iam:CreateAccessKey",
          "iam:DeleteAccessKey",
          "iam:ListAccessKeys",
          "iam:GetAccessKeyLastUsed",
          "iam:UpdateAccessKey"
        ]
        Resource = "arn:aws:iam::*:user/${aws:username}"
      },
      {
        Sid = "AllowManageOwnSigningCertificates"
        Effect = "Allow"
        Action = [
          "iam:DeleteSigningCertificate",
          "iam:ListSigningCertificates",
          "iam:UpdateSigningCertificate",
          "iam:UploadSigningCertificate"
        ]
        Resource = "arn:aws:iam::*:user/${aws:username}"
      },
      {
        Sid = "AllowManageOwnSSHPublicKeys"
        Effect = "Allow"
        Action = [
          "iam:DeleteSSHPublicKey",
          "iam:GetSSHPublicKey",
          "iam:ListSSHPublicKeys",
          "iam:UpdateSSHPublicKey",
          "iam:UploadSSHPublicKey"
        ]
        Resource = "arn:aws:iam::*:user/${aws:username}"
      },
      {
        Sid = "AllowManageOwnGitCredentials"
        Effect = "Allow"
        Action = [
          "iam:CreateServiceSpecificCredential",
          "iam:DeleteServiceSpecificCredential",
          "iam:ListServiceSpecificCredentials",
          "iam:ResetServiceSpecificCredential",
          "iam:UpdateServiceSpecificCredential"
        ]
        Resource = "arn:aws:iam::*:user/${aws:username}"
      },
      {
        Sid = "AllowManageOwnVirtualMFADevice"
        Effect = "Allow"
        Action = [
          "iam:CreateVirtualMFADevice"
        ]
        Resource = "arn:aws:iam::*:mfa/*"
      },
      {
        Sid = "AllowManageOwnUserMFA"
        Effect = "Allow"
        Action = [
          "iam:DeactivateMFADevice",
          "iam:EnableMFADevice",
          "iam:ListMFADevices",
          "iam:ResyncMFADevice"
        ]
        Resource = "arn:aws:iam::*:user/${aws:username}"
      },
      {
        Sid = "DenyAllExceptListedIfNoMFA"
        Effect = "Deny"
        NotAction = [
          "iam:CreateVirtualMFADevice",
          "iam:ChangePassword",
          "iam:EnableMFADevice",
          "iam:GetAccountPasswordPolicy",
          "iam:GetUser",
          "iam:ListMFADevices",
          "iam:ListVirtualMFADevices",
          "iam:ResyncMFADevice",
          "sts:GetSessionToken"
        ]
        Resource = "*"
        Condition = {
          BoolIfExists = {
            "aws:MultiFactorAuthPresent" = "false"
          }
        }
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
