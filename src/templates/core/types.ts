import { AwsOptions } from '@/templates/aws';

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

type CustomOption = {
  skipConfirmation: boolean;
};

export { AWSModuleName, AWSModule, CustomOption, awsModules };
