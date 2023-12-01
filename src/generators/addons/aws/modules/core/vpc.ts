import { dedent } from 'ts-dedent';

import { AwsOptions } from '@/generators/addons/aws';
import { AWS_TEMPLATE_PATH } from '@/generators/addons/aws/constants';
import { isAwsModuleAdded } from '@/generators/addons/aws/dependencies';
import {
  INFRA_CORE_MAIN_PATH,
  INFRA_CORE_OUTPUTS_PATH,
} from '@/generators/terraform/constants';
import { appendToFile, copy } from '@/helpers/file';

const vpcOutputsContent = dedent`
  output "vpc_id" {
    description = "VPC ID"
    value       = module.vpc.vpc_id
  }`;

const vpcModuleContent = dedent`
  module "vpc" {
    source    = "../modules/vpc"

    env_namespace = local.env_namespace
    region        = var.region
  }`;

const applyAwsVpc = async (options: AwsOptions) => {
  if (isAwsModuleAdded('vpc', options.projectName)) {
    return;
  }

  copy(`${AWS_TEMPLATE_PATH}/modules/vpc`, 'modules/vpc', options.projectName);
  appendToFile(INFRA_CORE_MAIN_PATH, vpcModuleContent, options.projectName);
  appendToFile(INFRA_CORE_OUTPUTS_PATH, vpcOutputsContent, options.projectName);
};

export default applyAwsVpc;
export { vpcModuleContent, vpcOutputsContent };
