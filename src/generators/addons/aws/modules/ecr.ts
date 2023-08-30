import { dedent } from 'ts-dedent';

import { AwsOptions } from '@/generators/addons/aws';
import { isAwsModuleAdded } from '@/generators/addons/aws/dependencies';
import {
  INFRA_SHARED_MAIN_PATH,
  INFRA_SHARED_VARIABLES_PATH,
} from '@/generators/core/constants';
import { appendToFile, copy } from '@/helpers/file';

import { AWS_SKELETON_PATH } from '../constants';

const ecrVariablesContent = dedent`
  variable "image_limit" {
    description = "Sets max amount of the latest develop images to be kept"
    type        = number
  }`;

const ecrModuleContent = dedent`
  module "ecr" {
    source = "../modules/ecr"

    namespace   = var.namespace
    image_limit = var.image_limit
  }`;

const applyAwsEcr = async (options: AwsOptions) => {
  if (isAwsModuleAdded('ecr', options.projectName)) {
    return;
  }

  copy(`${AWS_SKELETON_PATH}/modules/ecr`, 'modules/ecr', options.projectName);
  appendToFile(
    INFRA_SHARED_VARIABLES_PATH,
    ecrVariablesContent,
    options.projectName
  );
  appendToFile(INFRA_SHARED_MAIN_PATH, ecrModuleContent, options.projectName);
};

export default applyAwsEcr;
export { ecrVariablesContent, ecrModuleContent };
