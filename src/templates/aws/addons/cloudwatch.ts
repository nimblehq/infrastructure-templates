import { dedent } from 'ts-dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';
import { INFRA_BASE_MAIN_PATH } from '../../core/constants';

const cloudwatchModuleContent = dedent`
  module "cloudwatch" {
    source = "../modules/cloudwatch"

    namespace = var.namespace
  }`;

const applyCloudwatch = ({ projectName }: AwsOptions) => {
  copy('aws/modules/cloudwatch', 'modules/cloudwatch', projectName);
  appendToFile(INFRA_BASE_MAIN_PATH, cloudwatchModuleContent, projectName);
};

export default applyCloudwatch;
export { cloudwatchModuleContent };
