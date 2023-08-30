import { dedent } from 'ts-dedent';

import { AwsOptions } from '@/generators/addons/aws';
import { AWS_DEFAULT_REGION } from '@/generators/addons/aws/constants';
import {
  INFRA_CORE_VARIABLES_PATH,
  INFRA_SHARED_VARIABLES_PATH,
} from '@/generators/terraform/constants';
import { appendToFile } from '@/helpers/file';

const regionVariablesContent = (awsRegion: string) => dedent`
  variable "region" {
    description = "AWS region"
    type        = string
    default     = "${awsRegion}"
  }`;

const applyAwsRegion = async (options: AwsOptions) => {
  appendToFile(
    INFRA_CORE_VARIABLES_PATH,
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
