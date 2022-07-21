import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';

const applyVpc = ({projectName}: AwsOptions) => {
  const vpcOutputContent = dedent`
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

  copy('aws/modules/vpc', 'modules/vpc', projectName);
  appendToFile('outputs.tf', vpcOutputContent, projectName);
  appendToFile('main.tf', vpcModuleContent, projectName);
};

export default applyVpc;
