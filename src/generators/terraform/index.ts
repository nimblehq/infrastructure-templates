import { dedent } from 'ts-dedent';

import { GeneralOptions } from '@/commands/generate';
import {
  INFRA_CORE_MAIN_PATH,
  INFRA_SHARED_MAIN_PATH,
} from '@/generators/terraform/constants';
import { copy, rename, appendToFile } from '@/helpers/file';

const applyTerraformCore = async (generalOptions: GeneralOptions) => {
  const { projectName } = generalOptions;

  copy('terraform/', '.', projectName);

  // Use projectName to append the Namespace local in the main.tf file
  const coreLocalsContent = dedent`
      locals {
        env_namespace = "${projectName}-\${var.environment}"
      }`;

  appendToFile(INFRA_CORE_MAIN_PATH, coreLocalsContent, projectName);
  appendToFile(INFRA_SHARED_MAIN_PATH, coreLocalsContent, projectName);

  // Need to rename .gitignore to gitignore because NPN package doesn't include .gitignore
  // https://github.com/npm/npm/issues/3763
  rename('gitignore', '.gitignore', projectName);
};

export { applyTerraformCore };
