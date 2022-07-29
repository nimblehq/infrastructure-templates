import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';

const vpcOutputsContent = dedent`
  output "vpc_id" {
    description = "VPC ID"
    value       = module.vpc.vpc_id
  }
\n`;
const vpcModuleContent = dedent`
  module "vpc" {
    source    = "./modules/vpc"

    namespace = var.namespace
  }
\n`;

const applyVpc = ({ projectName }: AwsOptions) => {
  copy('aws/modules/vpc', 'modules/vpc', projectName);
  appendToFile('outputs.tf', vpcOutputsContent, projectName);
  appendToFile('main.tf', vpcModuleContent, projectName);
};

export default applyVpc;
export { vpcModuleContent, vpcOutputsContent };
