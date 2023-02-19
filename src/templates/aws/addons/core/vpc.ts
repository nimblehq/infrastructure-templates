import { dedent } from 'ts-dedent';

import { AwsOptions } from '../..';
import { appendToFile, copy } from '../../../../helpers/file';
import {
  INFRA_BASE_MAIN_PATH,
  INFRA_BASE_OUTPUTS_PATH,
} from '../../../core/constants';
import { isAWSModuleAdded } from '../../../core/dependencies';

const vpcOutputsContent = dedent`
  output "vpc_id" {
    description = "VPC ID"
    value       = module.vpc.vpc_id
  }`;

const vpcModuleContent = dedent`
  module "vpc" {
    source    = "../modules/vpc"

    namespace = var.namespace
  }`;

const applyVpc = async (options: AwsOptions) => {
  if (isAWSModuleAdded('vpc', options.projectName)) {
    return;
  }

  copy('aws/modules/vpc', 'modules/vpc', options.projectName);
  appendToFile(INFRA_BASE_MAIN_PATH, vpcModuleContent, options.projectName);
  appendToFile(INFRA_BASE_OUTPUTS_PATH, vpcOutputsContent, options.projectName);
};

export default applyVpc;
export { vpcModuleContent, vpcOutputsContent };
