import { prompt } from 'inquirer';

import { GeneralOptions } from '@/commands/generate';

import { applyAdvancedTemplate } from './advanced';
import { AWS_DEFAULT_REGION } from './constants';
import {
  applyTerraformAwsProvider,
  applyAwsIamUserAndGroup,
  applyAwsRegion,
  applyAwsSecurityGroup,
  applyAwsVpc,
} from './modules';

const awsChoices = [
  {
    type: 'list',
    name: 'infrastructureType',
    message: 'What kind of infrastructure do you need?',
    choices: [
      {
        key: 'blank',
        value: 'blank',
        name: 'Blank infrastructure (Terraform + AWS provider + folder structure)',
      },
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
    default: AWS_DEFAULT_REGION,
    message: 'Which AWS Region do you choose?',
  },
];

type AwsOptions = GeneralOptions & {
  infrastructureType?: 'blank' | 'advanced';
  awsRegion?: string;
};

const applyCommonModules = async (options: AwsOptions) => {
  await applyTerraformAwsProvider(options);
  await applyAwsRegion(options);
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
    case 'blank':
      await applyCommonModules(awsOptions);

      break;

    case 'advanced':
      await applyCommonModules(awsOptions);
      await applyAwsVpc(awsOptions);
      await applyAwsSecurityGroup(awsOptions);
      await applyAwsIamUserAndGroup(awsOptions);
      await applyAdvancedTemplate(awsOptions);

      break;
    default:
      throw Error('This type has not been implemented!');
  }
};

export type { AwsOptions };
export { generateAwsTemplate };
