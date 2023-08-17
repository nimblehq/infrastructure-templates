import { dedent } from 'ts-dedent';

import { appendToFile } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import { AWS_DEFAULT_REGION } from '@/templates/addons/aws/constants';
import {
  INFRA_BASE_VARIABLES_PATH,
  INFRA_SHARED_VARIABLES_PATH,
} from '@/templates/core/constants';

const regionVariablesContent = (awsRegion: string) => dedent`
  variable "region" {
    description = "AWS region"
    type        = string
    default     = "${awsRegion}"
  }`;

const applyAwsRegion = async (options: AwsOptions) => {
  appendToFile(
    INFRA_BASE_VARIABLES_PATH,
    regionVariablesContent(options.awsRegion || AWS_DEFAULT_REGION),
    options.projectName
  );
  appendToFile(
    INFRA_SHARED_VARIABLES_PATH,
    regionVariablesContent(options.awsRegion || AWS_DEFAULT_REGION),
    options.projectName
  );
};

export default applyAwsRegion;
export { regionVariablesContent };
