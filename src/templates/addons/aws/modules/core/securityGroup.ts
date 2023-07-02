import { dedent } from 'ts-dedent';

import { appendToFile, copy } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import { AWS_SKELETON_PATH } from '@/templates/addons/aws/constants';
import {
  INFRA_BASE_MAIN_PATH,
  INFRA_BASE_VARIABLES_PATH,
} from '@/templates/core/constants';
import {
  isAwsModuleAdded,
  requireAwsModules,
} from '@/templates/core/dependencies';

const securityGroupVariablesContent = dedent`
  variable "nimble_office_ip" {
    description = "Nimble Office IP"
  }`;

const securityGroupModuleContent = dedent`
  module "security_group" {
    source = "../modules/security_group"

    namespace                   = var.namespace
    vpc_id                      = module.vpc.vpc_id
    app_port                    = var.app_port
    private_subnets_cidr_blocks = module.vpc.private_subnets_cidr_blocks

    nimble_office_ip = var.nimble_office_ip
  }`;

const applyAwsSecurityGroup = async (options: AwsOptions) => {
  if (isAwsModuleAdded('securityGroup', options.projectName)) {
    return;
  }
  await requireAwsModules('securityGroup', 'vpc', options);

  copy(
    `${AWS_SKELETON_PATH}/modules/security_group`,
    'modules/security_group',
    options.projectName
  );
  appendToFile(
    INFRA_BASE_VARIABLES_PATH,
    securityGroupVariablesContent,
    options.projectName
  );
  appendToFile(
    INFRA_BASE_MAIN_PATH,
    securityGroupModuleContent,
    options.projectName
  );
};

export default applyAwsSecurityGroup;
export { securityGroupModuleContent, securityGroupVariablesContent };
