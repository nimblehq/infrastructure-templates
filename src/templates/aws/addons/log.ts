import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';

const logModuleContent = dedent`
  module "log" {
    source = "./modules/log"

    namespace = var.namespace
  }
\n`;

const applyLog = ({ projectName }: AwsOptions) => {
  copy('aws/modules/log', 'modules/log', projectName);
  appendToFile('main.tf', logModuleContent, projectName);
};

export default applyLog;
export { logModuleContent };
