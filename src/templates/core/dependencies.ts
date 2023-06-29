import { ux } from '@oclif/core';
import { prompt } from 'inquirer';

import { containsContent, isExisting } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
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
} from '@/templates/addons/aws/modules';

import { INFRA_BASE_MAIN_PATH } from './constants';
import { AWSModule, AWSModuleName, InstallationOptions } from './types';

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
    throw new Error(`Module '${dependency}' is not supported`);
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
  currentModule: AWSModuleName,
  awsModule: AWSModule,
  awsOptions: AwsOptions,
  options: InstallationOptions
): Promise<boolean> => {
  let result;

  if (options.skipConfirmation) {
    result = { apply: true };
  } else {
    // If currentModule is not a valid AWS module, it means that it is a project name
    const isProject = !AWS_MODULES[currentModule];
    const type = isProject ? 'project' : 'module';
    const currentName = currentModule === '.' ? 'current' : currentModule;

    result = await prompt({
      type: 'confirm',
      name: 'apply',
      message: `The '${currentName}' ${type} requires '${awsModule.name}' module. Do you want to add '${awsModule.name}' module?`,
      default: true,
    });
  }

  if (result.apply) {
    try {
      await awsModule.applyModuleFunction(awsOptions);
    } catch (error: any) { // eslint-disable-line
      ux.info(error.message);

      return false;
    }

    return true;
  }

  return false;
};

const requireAWSModules = async (
  currentModule: AWSModuleName,
  modules: Array<AWSModuleName | string> | AWSModuleName | string,
  awsOptions: AwsOptions,
  options: InstallationOptions = { skipConfirmation: false }
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
      if (AWS_MODULES[currentModule]) {
        throw new Error(
          `Module '${awsModule}' is required before adding '${currentModule}' module`
        );
      }

      const currentName = currentModule === '.' ? 'current' : currentModule;
      throw new Error(
        `Failed to install '${awsModule}' module to the '${currentName}' project`
      );
    }
  }

  return true;
};

export { requireAWSModules, isAWSModuleAdded };
