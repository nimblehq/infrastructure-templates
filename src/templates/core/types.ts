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
  name: AWSModuleName;
  path: string;
  mainContent: string;
  applyModuleFunction: (options: AwsOptions) => void | Promise<void>;
};

export { AWSModuleName, AWSModule };
