import dedent = require('dedent');
import { prompt } from 'inquirer';

import { GeneralOptions } from '@/commands/generate';
import {
  INFRA_CORE_MAIN_PATH,
  INFRA_SHARED_MAIN_PATH,
} from '@/generators/terraform/constants';
import { injectToFile } from '@/helpers/file';

type TerraformCloudOptions = {
  terraformCloudEnabled: boolean;
  terraformCloudOrganization: string;
  terraformCloudCoreWorkspace: string;
  terraformCloudSharedWorkspace: string;
};

const getTerraformCloudOptions = async (
  projectName: string
): Promise<TerraformCloudOptions> => {
  const terraformCloudPrompt = await prompt([
    {
      type: 'confirm',
      name: 'terraformCloudEnabled',
      message:
        'Would you like to enable Terraform Cloud?\nIf yes, the generated project will require 2 workspaces. One for the "shared" services, such as ERC, that will be used across all environments. The other workspace will be for the "core" services that will be created independently for each environment.',
      default: false,
    },
  ]);

  if (terraformCloudPrompt.terraformCloudEnabled) {
    const terraformCloudOptions = await prompt([
      {
        type: 'input',
        name: 'terraformCloudOrganization',
        message: 'What is your Terraform Cloud organization name?',
        default: 'nimble',
      },
      {
        type: 'input',
        name: 'terraformCloudCoreWorkspace',
        message:
          'What is your Terraform Cloud workspace name for the `core` workspace?',
        default: `${projectName}`,
      },
      {
        type: 'input',
        name: 'terraformCloudSharedWorkspace',
        message:
          'What is your Terraform Cloud workspace name for the `shared` workspace?',
        default: `${projectName}-shared`,
      },
    ]);

    return {
      terraformCloudEnabled: true,
      ...terraformCloudOptions,
    };
  }

  return {
    terraformCloudEnabled: false,
    terraformCloudOrganization: '',
    terraformCloudCoreWorkspace: '',
    terraformCloudSharedWorkspace: '',
  };
};

const applyTerraformCloud = async ({
  projectName,
}: GeneralOptions): Promise<void> => {
  const terraformCloudOptions = await getTerraformCloudOptions(projectName);

  if (!terraformCloudOptions.terraformCloudEnabled) {
    return;
  }

  injectToFile(
    INFRA_CORE_MAIN_PATH,
    dedent`
      cloud {
        organization = "${terraformCloudOptions.terraformCloudOrganization}"
        workspaces {
          name = "${terraformCloudOptions.terraformCloudCoreWorkspace}"
        }
      }`,
    projectName,
    {
      insertAfter: 'terraform {',
    }
  );

  injectToFile(
    INFRA_SHARED_MAIN_PATH,
    dedent`
      cloud {
        organization = "${terraformCloudOptions.terraformCloudOrganization}"
        workspaces {
          name = "${terraformCloudOptions.terraformCloudSharedWorkspace}"
        }
      }`,
    projectName,
    {
      insertAfter: 'terraform {',
    }
  );
};

export { applyTerraformCloud };
