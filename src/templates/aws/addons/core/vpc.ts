import * as dedent from 'dedent';

import { AwsOptions } from '../..';
import { appendToFile, copy } from '../../../../helpers/file';
import {
  INFRA_BASE_MAIN_PATH,
  INFRA_BASE_OUTPUTS_PATH,
} from '../../../core/constants';

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

const applyVpc = ({ projectName }: AwsOptions) => {
  copy('aws/modules/vpc', 'modules/vpc', projectName);
  appendToFile(INFRA_BASE_MAIN_PATH, vpcModuleContent, projectName);
  appendToFile(INFRA_BASE_OUTPUTS_PATH, vpcOutputsContent, projectName);
};

export default applyVpc;
export { vpcModuleContent, vpcOutputsContent };
