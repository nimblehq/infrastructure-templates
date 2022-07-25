import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copyDir } from '../../../helpers/file';

const applyEcr = ({ projectName }: AwsOptions) => {
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

  copyDir('aws/modules/ecr', 'modules/ecr', projectName);
  appendToFile('variables.tf', ecrVariablesContent, projectName);
  appendToFile('main.tf', ecrModuleContent, projectName);
};

export default applyEcr;
