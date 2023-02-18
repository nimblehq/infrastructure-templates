import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';
import { INFRA_BASE_MAIN_PATH } from '../../core/constants';

const logModuleContent = dedent`
  module "log" {
    source = "./modules/log"

    namespace = var.namespace
  }`;

const applyLog = ({ projectName }: AwsOptions) => {
  copy('aws/modules/log', 'modules/log', projectName);
  appendToFile(INFRA_BASE_MAIN_PATH, logModuleContent, projectName);
};

export default applyLog;
export { logModuleContent };
