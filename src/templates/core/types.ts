import { AwsOptions } from '../aws';

type AWSModuleName =
  | 'vpc'
  | 'securityGroup'
  | 'alb'
  | 'bastion'
  | 'ecr'
  | 'ecs'
  | 'log'
  | 'rds'
  | 's3'
  | 'ssm';

type AWSModule = {
  path: string;
  mainContent: string;
  applyModuleFunction: (options: AwsOptions) => void;
};

export { AWSModuleName, AWSModule };
