import { dedent } from 'ts-dedent';

import { AwsOptions } from '@/generators/addons/aws';
import { AWS_TEMPLATE_PATH } from '@/generators/addons/aws/constants';
import {
  isAwsModuleAdded,
  requireAwsModules,
} from '@/generators/addons/aws/dependencies';
import {
  INFRA_CORE_MAIN_PATH,
  INFRA_CORE_VARIABLES_PATH,
} from '@/generators/terraform/constants';
import { appendToFile, copy } from '@/helpers/file';

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
    `${AWS_TEMPLATE_PATH}/modules/security_group`,
    'modules/security_group',
    options.projectName
  );
  appendToFile(
    INFRA_CORE_VARIABLES_PATH,
    securityGroupVariablesContent,
    options.projectName
  );
  appendToFile(
    INFRA_CORE_MAIN_PATH,
    securityGroupModuleContent,
    options.projectName
  );
};

export default applyAwsSecurityGroup;
export { securityGroupModuleContent, securityGroupVariablesContent };
