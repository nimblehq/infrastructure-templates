import { dedent } from 'ts-dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';
import {
  INFRA_SHARED_MAIN_PATH,
  INFRA_SHARED_VARIABLES_PATH,
} from '../../core/constants';
import { isAWSModuleAdded } from '../../core/dependencies';

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

const applyEcr = async (options: AwsOptions) => {
  if (isAWSModuleAdded('ecr', options.projectName)) {
    return;
  }

  copy('aws/modules/ecr', 'modules/ecr', options.projectName);
  appendToFile(
    INFRA_SHARED_VARIABLES_PATH,
    ecrVariablesContent,
    options.projectName
  );
  appendToFile(INFRA_SHARED_MAIN_PATH, ecrModuleContent, options.projectName);
};

export default applyEcr;
export { ecrVariablesContent, ecrModuleContent };
