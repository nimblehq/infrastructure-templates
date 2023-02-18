import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile } from '../../../helpers/file';
import { INFRA_BASE_VARIABLES_PATH } from '../../core/constants';

const regionVariablesContent = (awsRegion: string) => dedent`
  variable "region" {
    description = "AWS region"
    type        = string
    default     = "${awsRegion}"
  }`;

const applyRegion = ({ awsRegion, projectName }: AwsOptions) => {
  appendToFile(
    INFRA_BASE_VARIABLES_PATH,
    regionVariablesContent(awsRegion),
    projectName
  );
};

export default applyRegion;
export { regionVariablesContent };
