import * as inquirer from 'inquirer';

import { GeneralOptions } from '../../commands/generate';
import { applyAdvancedTemplate } from './advanced';

const awsChoices = [
  {
    type: 'list',
    name: 'infrastructureType',
    message: 'What kind of infrastructure do you need?',
    choices: [
      {
        key: 'basic',
        value: 'basic',
        name: 'Basic infrastructure (VPC + RDS + LOG + ECS) (NOT IMPLEMENTED YET)',
        disabled: true,
      },
      {
        key: 'advanced',
        value: 'advanced',
        name: 'Complete infrastructure (VPC + ECR + RDS + S3 + FARGATE + LOG + Security groups + ALB)',
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
  infrastructureType: 'basic' | 'advanced';
  awsRegion: string;
}

const generateAwsTemplate = async(generalOptions: GeneralOptions): Promise<void> => {
  const awsOptionsPrompt = await inquirer.prompt(awsChoices);
  const awsOptions: AwsOptions = {
    ...generalOptions,
    infrastructureType: awsOptionsPrompt.infrastructureType,
    awsRegion: awsOptionsPrompt.awsRegion,
  };

  switch (awsOptions.infrastructureType) {
    case 'advanced':
      applyAdvancedTemplate(awsOptions);

      break;
    case 'basic':
    default:
      throw Error('This type has not been implemented!');
  }
};

export type { AwsOptions};
export { generateAwsTemplate };
