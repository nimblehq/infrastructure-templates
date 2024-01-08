import { dedent } from 'ts-dedent';

import { AwsOptions } from '@/generators/addons/aws';
import { AWS_TEMPLATE_PATH } from '@/generators/addons/aws/constants';
import {
  INFRA_SHARED_MAIN_PATH,
  INFRA_SHARED_VARIABLES_PATH,
  INFRA_SHARED_OUTPUTS_PATH,
} from '@/generators/terraform/constants';
import { appendToFile, copy } from '@/helpers/file';

const iamVariablesContent = dedent`
  variable "iam_admin_emails" {
    description = "List of admin emails to provision IAM user account"
    type        = list(string)
  }

  variable "iam_infra_service_account_emails" {
    description = "List of infra service account emails to provision IAM user account"
    type        = list(string)
  }

  variable "iam_developer_emails" {
    description = "List of developer emails to provision IAM user account"
    type        = list(string)
  }`;

const iamGroupsModuleContent = dedent`
  module "iam_groups" {
    source = "../modules/iam_groups"

    project_name = local.project_name
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

  module "iam_infra_service_account_users" {
    source = "../modules/iam_users"

    usernames = var.iam_infra_service_account_emails
    has_login = false
  }`;

const iamGroupMembershipModuleContent = dedent`
  module "iam_group_membership" {
    source = "../modules/iam_group_membership"

    for_each = {
      admin                 = { group = module.iam_groups.admin_group, users = var.iam_admin_emails },
      infra_service_account = { group = module.iam_groups.infra_service_account_group, users = var.iam_infra_service_account_emails },
      developer             = { group = module.iam_groups.developer_group, users = var.iam_developer_emails }
    }

    name  = "\${each.key}-group-membership"
    group = each.value.group
    users = each.value.users

    depends_on = [
      module.iam_groups,
      module.iam_admin_users,
      module.iam_developer_users,
      module.iam_infra_service_account_users,
    ]
  }`;

const iamOutputsContent = dedent`
  output "iam_admin_temporary_passwords" {
    description = "List of first time passwords for admin accounts. Must be changed at first time login and will no longer be valid."
    value       = module.iam_admin_users.temporary_passwords
  }

  output "iam_developer_temporary_passwords" {
    description = "List of first time passwords for developer accounts. Must be changed at first time login and will no longer be valid."
    value       = module.iam_developer_users.temporary_passwords
  }`;

const applyAwsIamUserAndGroup = async ({ projectName }: AwsOptions) => {
  copy(
    `${AWS_TEMPLATE_PATH}/modules/iam_groups`,
    'modules/iam_groups',
    projectName
  );
  copy(
    `${AWS_TEMPLATE_PATH}/modules/iam_users`,
    'modules/iam_users',
    projectName
  );
  copy(
    `${AWS_TEMPLATE_PATH}/modules/iam_group_membership`,
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
