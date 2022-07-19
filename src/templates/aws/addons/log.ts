import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copyDir } from '../../../helpers/file';

const applyLog = ({ projectName }: AwsOptions) => {
  const logModuleContent = dedent`
    module "log" {
      source = "./modules/log"

      namespace = var.namespace
    }
  \n`;

  copyDir('aws/modules/log', 'modules/log', projectName);
  appendToFile('main.tf', logModuleContent, projectName);
};

export default applyLog;
