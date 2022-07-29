import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';

const securityGroupVariablesContent = dedent`
  variable "nimble_office_ip" {
    description = "Nimble Office IP"
  }
\n`;
const securityGroupModuleContent = dedent`
  module "security_group" {
    source = "./modules/security_group"

    namespace                   = var.namespace
    vpc_id                      = module.vpc.vpc_id
    app_port                    = var.app_port
    private_subnets_cidr_blocks = module.vpc.private_subnets_cidr_blocks

    nimble_office_ip = var.nimble_office_ip
  }
\n`;

const applySecurityGroup = ({ projectName }: AwsOptions) => {
  copy('aws/modules/security_group', 'modules/security_group', projectName);
  appendToFile('variables.tf', securityGroupVariablesContent, projectName);
  appendToFile('main.tf', securityGroupModuleContent, projectName);
};

export default applySecurityGroup;
export { securityGroupModuleContent, securityGroupVariablesContent };
