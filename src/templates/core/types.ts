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

type AwsModuleName = typeof awsModules[number] | string;

type AwsModule = {
  name: AwsModuleName;
  path: string;
  mainContent: string;
  applyModuleFunction: (options: AwsOptions) => void | Promise<void>;
};

type InstallationOptions = {
  skipConfirmation: boolean;
};

export { AwsModuleName, AwsModule, InstallationOptions, awsModules };
