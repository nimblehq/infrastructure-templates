import { dedent } from 'ts-dedent';

import { AwsOptions } from '@/generators/addons/aws';
import { AWS_SKELETON_PATH } from '@/generators/addons/aws/constants';
import {
  INFRA_SHARED_MAIN_PATH,
  INFRA_SHARED_VARIABLES_PATH,
  INFRA_SHARED_OUTPUTS_PATH,
} from '@/generators/core/constants';
import { appendToFile, copy } from '@/helpers/file';

const iamVariablesContent = dedent`
  variable "iam_admin_emails" {
    description = "List of admin emails to provision IAM user account"
    type        = list(string)
  }

  variable "iam_bot_emails" {
    description = "List of bot emails to provision IAM user account"
    type        = list(string)
  }

  variable "iam_developer_emails" {
    description = "List of developer emails to provision IAM user account"
    type        = list(string)
  }`;

const iamGroupsModuleContent = dedent`
  module "iam_groups" {
    source = "../modules/iam_groups"
  }`;

const iamUsersModuleContent = dedent`
  module "iam_admin_users" {
    source = "../modules/iam_users"

    usernames = var.iam_admin_emails
  }

  module "iam_developer_users" {
    source = "../modules/iam_users"

    usernames = var.iam_developer_emails
  }

  module "iam_bot_users" {
    source = "../modules/iam_users"

    usernames = var.iam_bot_emails
  }`;

const iamGroupMembershipModuleContent = dedent`
  module "iam_admin_group_membership" {
    source = "../modules/iam_group_membership"

    name  = "admin-group-membership"
    group = module.iam_groups.admin_group
    users = var.iam_admin_emails
  }

  module "iam_bot_group_membership" {
    source = "../modules/iam_group_membership"

    name  = "bot-group-membership"
    group = module.iam_groups.bot_group
    users = var.iam_bot_emails
  }

  module "iam_developer_group_membership" {
    source = "../modules/iam_group_membership"

    name  = "developer-group-membership"
    group = module.iam_groups.developer_group
    users = var.iam_developer_emails
  }`;

const iamOutputsContent = dedent`
  output "iam_admin_temporary_passwords" {
    description = "List of first time passwords for admin accounts. Must be changed at first time login and will no longer be valid."
    value       = module.iam_admin_users.temporary_passwords
  }

  output "iam_developer_temporary_passwords" {
    description = "List of first time passwords for developer accounts. Must be changed at first time login and will no longer be valid."
    value       = module.iam_developer_users.temporary_passwords
  }

  output "iam_bot_temporary_passwords" {
    description = "List of first time passwords for bot accounts. Must be changed at first time login and will no longer be valid."
    value       = module.iam_bot_users.temporary_passwords
  }`;

const applyAwsIamUserAndGroup = async ({ projectName }: AwsOptions) => {
  copy(
    `${AWS_SKELETON_PATH}/modules/iam_groups`,
    'modules/iam_groups',
    projectName
  );
  copy(
    `${AWS_SKELETON_PATH}/modules/iam_users`,
    'modules/iam_users',
    projectName
  );
  copy(
    `${AWS_SKELETON_PATH}/modules/iam_group_membership`,
    'modules/iam_group_membership',
    projectName
  );
  appendToFile(INFRA_SHARED_MAIN_PATH, iamGroupsModuleContent, projectName);
  appendToFile(INFRA_SHARED_MAIN_PATH, iamUsersModuleContent, projectName);

  appendToFile(
    INFRA_SHARED_MAIN_PATH,
    iamGroupMembershipModuleContent,
    projectName
  );

  appendToFile(INFRA_SHARED_VARIABLES_PATH, iamVariablesContent, projectName);
  appendToFile(INFRA_SHARED_OUTPUTS_PATH, iamOutputsContent, projectName);
};

export default applyAwsIamUserAndGroup;
export {
  iamVariablesContent,
  iamGroupsModuleContent,
  iamUsersModuleContent,
  iamGroupMembershipModuleContent,
  iamOutputsContent,
};
