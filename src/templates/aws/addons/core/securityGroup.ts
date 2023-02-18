import { dedent } from 'ts-dedent';

import { AwsOptions } from '../..';
import { appendToFile, copy } from '../../../../helpers/file';
import {
  INFRA_BASE_MAIN_PATH,
  INFRA_BASE_VARIABLES_PATH,
} from '../../../core/constants';

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

const applySecurityGroup = ({ projectName }: AwsOptions) => {
  copy('aws/modules/security_group', 'modules/security_group', projectName);
  appendToFile(
    INFRA_BASE_VARIABLES_PATH,
    securityGroupVariablesContent,
    projectName
  );
  appendToFile(INFRA_BASE_MAIN_PATH, securityGroupModuleContent, projectName);
};

export default applySecurityGroup;
export { securityGroupModuleContent, securityGroupVariablesContent };