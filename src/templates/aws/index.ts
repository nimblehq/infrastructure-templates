import * as inquirer from 'inquirer';

import { GeneralOptions } from '../../commands/generate';
import Advanced from './advanced';

const awsChoices = [
  {
    type: 'list',
    name: 'infrastructureType',
    message: 'What kind of infrastructure do you need?',
    choices: [
      {
        key: 'basic',
        value: 'basic',
        name: 'Basic infrastructure (VPC + RDS + LOG + ECS)',
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
  infrastructureType: string;
  awsRegion: string;
}

export default class Aws {
  generalOptions: GeneralOptions;

  constructor(generalOptions: GeneralOptions) {
    this.generalOptions = generalOptions;
  }

  async run(): Promise<void> {
    const awsOptionsPrompt = await inquirer.prompt(awsChoices);
    const awsOptions: AwsOptions = {
      ...this.generalOptions,
      infrastructureType: awsOptionsPrompt.infrastructureType,
      awsRegion: awsOptionsPrompt.awsRegion,
    };

    switch (awsOptions.infrastructureType) {
      case 'advanced':
        Advanced.run(awsOptions);
        break;
      case 'basic':
      default:
        throw Error('This type has not been implemented!');
    }
  }
}

export type {
  AwsOptions,
};
