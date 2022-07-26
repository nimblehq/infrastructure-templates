import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile } from '../../../helpers/file';

const regionVariablesContent = (awsRegion: string) => dedent`
  variable "region" {
    description = "AWS region"
    type        = string
    default     = "${awsRegion}"
  }
\n`;

const applyRegion = ({ awsRegion, projectName }: AwsOptions) => {
  appendToFile('variables.tf', regionVariablesContent(awsRegion), projectName);
};

export default applyRegion;
export { regionVariablesContent };
