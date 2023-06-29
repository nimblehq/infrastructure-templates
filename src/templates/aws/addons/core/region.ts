import { dedent } from 'ts-dedent';

import { appendToFile } from '@/helpers/file';
import { AwsOptions } from '@/templates/aws';
import { INFRA_BASE_VARIABLES_PATH } from '@/templates/core/constants';

const DEFAULT_REGION = 'ap-southeast-1';

const regionVariablesContent = (awsRegion: string) => dedent`
  variable "region" {
    description = "AWS region"
    type        = string
    default     = "${awsRegion}"
  }`;

const applyRegion = async (options: AwsOptions) => {
  appendToFile(
    INFRA_BASE_VARIABLES_PATH,
    regionVariablesContent(options.awsRegion || DEFAULT_REGION),
    options.projectName
  );
};

export default applyRegion;
export { regionVariablesContent };
