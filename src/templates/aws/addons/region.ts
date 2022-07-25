import * as dedent from 'dedent';

import { AwsOptions } from '..';
import { appendToFile } from '../../../helpers/file';

const applyRegion = ({ awsRegion, projectName }: AwsOptions) => {
  const regionVariableContent = dedent`
    variable "region" {
      description = "AWS region"
      type        = string
      default     = "${awsRegion}"
    }
  \n`;

  appendToFile('variables.tf', regionVariableContent, projectName);
};

export default applyRegion;
