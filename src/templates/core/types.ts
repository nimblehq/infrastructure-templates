import { AwsOptions } from '@/templates/addons/aws';

const awsModules = [
  'vpc',
  'securityGroup',
  'alb',
  'bastion',
  'ecr',
  'ecs',
  'cloudwatch',
  'rds',
  's3',
  'ssm',
] as const;

type AWSModuleName = typeof awsModules[number] | string;

type AWSModule = {
  name: AWSModuleName;
  path: string;
  mainContent: string;
  applyModuleFunction: (options: AwsOptions) => void | Promise<void>;
};

type InstallationOptions = {
  skipConfirmation: boolean;
};

export { AWSModuleName, AWSModule, InstallationOptions, awsModules };
