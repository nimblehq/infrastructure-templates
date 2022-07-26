import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';

const ecrVariablesContent = dedent`
  variable "image_limit" {
    description = "Sets max amount of the latest develop images to be kept"
    type        = number
  }
\n`;
const ecrModuleContent = dedent`
  module "ecr" {
    source = "./modules/ecr"

    namespace   = var.namespace
    image_limit = var.image_limit
  }
\n`;

const applyEcr = ({ projectName }: AwsOptions) => {
  copy('aws/modules/ecr', 'modules/ecr', projectName);
  appendToFile('variables.tf', ecrVariablesContent, projectName);
  appendToFile('main.tf', ecrModuleContent, projectName);
};

export default applyEcr;
export { ecrVariablesContent, ecrModuleContent };
