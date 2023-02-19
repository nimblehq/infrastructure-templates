import { containsContent, isExisting } from '../../helpers/file';
import { applyAlb, applyBastion, applyEcr, applyEcs, applyLog, applyRds, applyS3, applySecurityGroup, applySsm, applyVpc } from '../aws/addons';
import { INFRA_BASE_MAIN_PATH } from './constants';
import { AWSModule, AWSModuleName } from './types';

const AWS_MODULES: Record<AWSModuleName, AWSModule> = {
  vpc: {
    path: 'modules/vpc',
    mainContent: 'module "vpc"',
    applyModuleFunction: applyVpc,
  },
  securityGroup: {
    path: 'modules/security_group',
    mainContent: 'module "security_group"',
    applyModuleFunction: applySecurityGroup,
  },
  alb: {
    path: 'modules/alb',
    mainContent: 'module "alb"',
    applyModuleFunction: applyAlb,
  },
  bastion: {
    path: 'modules/bastion',
    mainContent: 'module "bastion"',
    applyModuleFunction: applyBastion,
  },
  ecr: {
    path: 'modules/ecr',
    mainContent: 'module "ecr"',
    applyModuleFunction: applyEcr,
  },
  ecs: {
    path: 'modules/ecs',
    mainContent: 'module "ecs"',
    applyModuleFunction: applyEcs,
  },
  log: {
    path: 'modules/log',
    mainContent: 'module "log"',
    applyModuleFunction: applyLog,
  },
  rds: {
    path: 'modules/rds',
    mainContent: 'module "rds"',
    applyModuleFunction: applyRds,
  },
  s3: {
    path: 'modules/s3',
    mainContent: 'module "s3"',
    applyModuleFunction: applyS3,
  },
  ssm: {
    path: 'modules/ssm',
    mainContent: 'module "ssm"',
    applyModuleFunction: applySsm,
  },
};

const isAWSModuleAdded = (
  dependency: AWSModuleName,
  projectName: string
): boolean => {
  const module = AWS_MODULES[dependency];
  if (!module) {
    throw new Error(`Dependency ${dependency} is not supported`);
  }

  const isModuleExisting = isExisting(module.path, projectName);
  const isModuleAdded = containsContent(
    INFRA_BASE_MAIN_PATH,
    module.mainContent,
    projectName
  );

  return isModuleExisting && isModuleAdded;
};

const requireAWSModules = (
  modules: AWSModuleName[] | AWSModuleName,
  projectName: string
): void => {
  modules = Array.isArray(modules) ? modules : [modules];

  modules.forEach((module) => {
    if (isAWSModuleAdded(module, projectName)) {
      console.log(`Module ${module} is already added`);
      return;
    }
  });
};

export { checkDependencies };
