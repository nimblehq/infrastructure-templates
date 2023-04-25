import { prompt } from 'inquirer';

import { containsContent, isExisting } from '@/helpers/file';
import { AwsOptions } from '@/templates/aws';
import {
  applyAlb,
  applyBastion,
  applyEcr,
  applyEcs,
  applyCloudwatch,
  applyRds,
  applyS3,
  applySecurityGroup,
  applySsm,
  applyVpc,
} from '@/templates/aws/addons';

import { INFRA_BASE_MAIN_PATH } from './constants';
import { AWSModule, AWSModuleName, CustomOption } from './types';

const AWS_MODULES: Record<AWSModuleName | string, AWSModule> = {
  vpc: {
    name: 'vpc',
    path: 'modules/vpc',
    mainContent: 'module "vpc"',
    applyModuleFunction: (options: AwsOptions) => applyVpc(options),
  },
  securityGroup: {
    name: 'securityGroup',
    path: 'modules/security_group',
    mainContent: 'module "security_group"',
    applyModuleFunction: (options: AwsOptions) => applySecurityGroup(options),
  },
  alb: {
    name: 'alb',
    path: 'modules/alb',
    mainContent: 'module "alb"',
    applyModuleFunction: (options: AwsOptions) => applyAlb(options),
  },
  bastion: {
    name: 'bastion',
    path: 'modules/bastion',
    mainContent: 'module "bastion"',
    applyModuleFunction: (options: AwsOptions) => applyBastion(options),
  },
  ecr: {
    name: 'ecr',
    path: 'modules/ecr',
    mainContent: 'module "ecr"',
    applyModuleFunction: (options: AwsOptions) => applyEcr(options),
  },
  ecs: {
    name: 'ecs',
    path: 'modules/ecs',
    mainContent: 'module "ecs"',
    applyModuleFunction: (options: AwsOptions) => applyEcs(options),
  },
  cloudwatch: {
    name: 'cloudwatch',
    path: 'modules/cloudwatch',
    mainContent: 'module "cloudwatch"',
    applyModuleFunction: (options: AwsOptions) => applyCloudwatch(options),
  },
  rds: {
    name: 'rds',
    path: 'modules/rds',
    mainContent: 'module "rds"',
    applyModuleFunction: (options: AwsOptions) => applyRds(options),
  },
  s3: {
    name: 's3',
    path: 'modules/s3',
    mainContent: 'module "s3"',
    applyModuleFunction: (options: AwsOptions) => applyS3(options),
  },
  ssm: {
    name: 'ssm',
    path: 'modules/ssm',
    mainContent: 'module "ssm"',
    applyModuleFunction: (options: AwsOptions) => applySsm(options),
  },
};

const isAWSModuleAdded = (
  dependency: AWSModuleName | string,
  projectName: string
): boolean => {
  const module = AWS_MODULES[dependency];
  if (!module) {
    throw new Error(`Module \`${dependency}\` is not supported`);
  }

  const isModuleExisting = isExisting(module.path, projectName);
  const isModuleAdded = containsContent(
    INFRA_BASE_MAIN_PATH,
    module.mainContent,
    projectName
  );

  return isModuleExisting && isModuleAdded;
};

const applyAWSModule = async (
  currentAwsModule: AWSModuleName,
  awsModule: AWSModule,
  awsOptions: AwsOptions,
  options: CustomOption
): Promise<boolean> => {
  let result;

  if (options.skipConfirmation) {
    result = { apply: true };
  } else {
    const isProject = !AWS_MODULES[currentAwsModule];
    const currentName = currentAwsModule === '.' ? 'current' : currentAwsModule;

    result = await prompt({
      type: 'confirm',
      name: 'apply',
      message: `The \`${currentName}\` ${
        isProject ? 'project' : 'module'
      } requires \`${awsModule.name}\` module. Do you want to add \`${
        awsModule.name
      }\` module?`,
      default: true,
    });
  }

  if (result.apply) {
    try {
      await awsModule.applyModuleFunction(awsOptions);
    } catch (error) {
      console.log(`Module \`${awsModule.name}\` was not added:`, error);

      return false;
    }

    console.log(`Module \`${awsModule.name}\` has been added`);
    return true;
  }

  console.log(`Module \`${awsModule.name}\` was not added`);
  return false;
};

const requireAWSModules = async (
  currentModule: AWSModuleName,
  modules: Array<AWSModuleName | string> | AWSModuleName | string,
  awsOptions: AwsOptions,
  options: CustomOption = { skipConfirmation: false }
): Promise<boolean> => {
  const awsModules = Array.isArray(modules) ? modules : [modules];

  for (const awsModule of awsModules) {
    if (isAWSModuleAdded(awsModule, awsOptions.projectName)) {
      continue;
    }

    const result = await applyAWSModule(
      currentModule,
      AWS_MODULES[awsModule],
      awsOptions,
      options
    );

    if (!result) {
      throw new Error(
        `Module \`${awsModule}\` is required before adding \`${currentModule}\` module`
      );
    }
  }

  return true;
};

export { requireAWSModules, isAWSModuleAdded };
