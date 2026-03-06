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

type AwsOptions = GeneralOptions & {
  infrastructureType?: 'blank' | 'advanced';
  awsRegion?: string;
  enabledSecurityFeatures?: boolean;
  addonModules?: string[];
};

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
    type: 'confirm',
    name: 'enabledSecurityFeatures',
    message: 'Do you want to add more modules(VPC Flow Logs, CloudTrail)?',
    default: false,
    when: (answers: AwsOptions) => answers.infrastructureType === 'advanced',
  },
  {
    type: 'checkbox',
    name: 'addonModules',
    message: 'Which security features do you want to add?',
    choices: [
      {
        key: 'vpcFlowLog',
        value: 'vpcFlowLog',
        name: 'VPC Flow Logs',
      },
      {
        key: 'cloudTrail',
        value: 'cloudTrail',
        name: 'CloudTrail',
      },
    ],
    when: (answers: AwsOptions) => answers.enabledSecurityFeatures,
  },
  {
    type: 'input',
    name: 'awsRegion',
    default: AWS_DEFAULT_REGION,
    message: 'Which AWS Region do you choose?',
  },
];

const applyProviderAndRegion = async (options: AwsOptions) => {
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
    addonModules: awsOptionsPrompt.addonModules,
  };

  switch (awsOptions.infrastructureType) {
    case 'blank':
      await applyProviderAndRegion(awsOptions);

      break;

    case 'advanced':
      await applyProviderAndRegion(awsOptions);
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
