import { ux } from '@oclif/core';
import { prompt } from 'inquirer';

import { AwsOptions } from '@/generators/addons/aws';
import {
  applyAwsAlb,
  applyAwsBastion,
  applyAwsEcr,
  applyAwsEcs,
  applyAwsCloudwatch,
  applyAwsRds,
  applyAwsS3,
  applyAwsSecurityGroup,
  applyAwsSsm,
  applyAwsVpc,
} from '@/generators/addons/aws/modules';
import { containsContent, isExisting } from '@/helpers/file';

import { INFRA_CORE_MAIN_PATH } from '../../terraform/constants';
import {
  AwsModule,
  AwsModuleName,
  InstallationOptions,
} from '../../terraform/types';

const AWS_MODULES: Record<AwsModuleName | string, AwsModule> = {
  vpc: {
    name: 'vpc',
    path: 'modules/vpc',
    mainContent: 'module "vpc"',
    applyModuleFunction: (options: AwsOptions) => applyAwsVpc(options),
  },
  securityGroup: {
    name: 'securityGroup',
    path: 'modules/security_group',
    mainContent: 'module "security_group"',
    applyModuleFunction: (options: AwsOptions) =>
      applyAwsSecurityGroup(options),
  },
  alb: {
    name: 'alb',
    path: 'modules/alb',
    mainContent: 'module "alb"',
    applyModuleFunction: (options: AwsOptions) => applyAwsAlb(options),
  },
  bastion: {
    name: 'bastion',
    path: 'modules/bastion',
    mainContent: 'module "bastion"',
    applyModuleFunction: (options: AwsOptions) => applyAwsBastion(options),
  },
  ecr: {
    name: 'ecr',
    path: 'modules/ecr',
    mainContent: 'module "ecr"',
    applyModuleFunction: (options: AwsOptions) => applyAwsEcr(options),
  },
  ecs: {
    name: 'ecs',
    path: 'modules/ecs',
    mainContent: 'module "ecs"',
    applyModuleFunction: (options: AwsOptions) => applyAwsEcs(options),
  },
  cloudwatch: {
    name: 'cloudwatch',
    path: 'modules/cloudwatch',
    mainContent: 'module "cloudwatch"',
    applyModuleFunction: (options: AwsOptions) => applyAwsCloudwatch(options),
  },
  rds: {
    name: 'rds',
    path: 'modules/rds',
    mainContent: 'module "rds"',
    applyModuleFunction: (options: AwsOptions) => applyAwsRds(options),
  },
  s3: {
    name: 's3',
    path: 'modules/s3',
    mainContent: 'module "s3"',
    applyModuleFunction: (options: AwsOptions) => applyAwsS3(options),
  },
  ssm: {
    name: 'ssm',
    path: 'modules/ssm',
    mainContent: 'module "ssm"',
    applyModuleFunction: (options: AwsOptions) => applyAwsSsm(options),
  },
};

const isAwsModuleAdded = (
  dependency: AwsModuleName | string,
  projectName: string
): boolean => {
  const module = AWS_MODULES[dependency];
  if (!module) {
    throw new Error(`Module '${dependency}' is not supported`);
  }

  const isModuleExisting = isExisting(module.path, projectName);
  const isModuleAdded = containsContent(
    INFRA_CORE_MAIN_PATH,
    module.mainContent,
    projectName
  );

  return isModuleExisting && isModuleAdded;
};

const applyAwsModule = async (
  currentModule: AwsModuleName,
  awsModule: AwsModule,
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

const requireAwsModules = async (
  currentModule: AwsModuleName,
  modules: Array<AwsModuleName | string> | AwsModuleName | string,
  awsOptions: AwsOptions,
  options: InstallationOptions = { skipConfirmation: false }
): Promise<boolean> => {
  const awsModules = Array.isArray(modules) ? modules : [modules];

  for (const awsModule of awsModules) {
    if (isAwsModuleAdded(awsModule, awsOptions.projectName)) {
      continue;
    }

    const result = await applyAwsModule(
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

export { requireAwsModules, isAwsModuleAdded };
