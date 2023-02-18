import { prompt } from 'inquirer';

import { GeneralOptions } from '../../commands/generate';
import {
  applyCommon,
  applyRegion,
  applySecurityGroup,
  applyVpc,
} from './addons';
import { applyAdvancedTemplate } from './advanced';

const awsChoices = [
  {
    type: 'list',
    name: 'infrastructureType',
    message: 'What kind of infrastructure do you need?',
    choices: [
      {
        key: 'advanced',
        value: 'advanced',
        name: 'Complete infrastructure (VPC + ECR + RDS + S3 + FARGATE + Cloudwatch + Security groups + ALB)',
      },
    ],
  },
  {
    type: 'input',
    name: 'awsRegion',
    default: 'ap-southeast-1',
    message: 'Which AWS Region do you choose?',
  },
];

type AwsOptions = GeneralOptions & {
  infrastructureType: 'advanced';
  awsRegion: string;
};

const applyCommonModules = (options: AwsOptions): void => {
  applyCommon(options);
  applyRegion(options);
};

const generateAwsTemplate = async (
  generalOptions: GeneralOptions
): Promise<void> => {
  const awsOptionsPrompt = await prompt(awsChoices);
  const awsOptions: AwsOptions = {
    ...generalOptions,
    infrastructureType: awsOptionsPrompt.infrastructureType,
    awsRegion: awsOptionsPrompt.awsRegion,
  };

  switch (awsOptions.infrastructureType) {
    case 'advanced':
      applyCommonModules(awsOptions);
      applyVpc(awsOptions);
      applySecurityGroup(awsOptions);
      applyAdvancedTemplate(awsOptions);

      break;
    default:
      throw Error('This type has not been implemented!');
  }
};

export type { AwsOptions };
export { generateAwsTemplate };
