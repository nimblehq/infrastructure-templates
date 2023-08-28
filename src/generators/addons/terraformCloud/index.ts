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
  terraformCloudWorkspace: string;
};

const getTerraformCloudOptions = async (): Promise<TerraformCloudOptions> => {
  const terraformCloudPrompt = await prompt([
    {
      type: 'confirm',
      name: 'terraformCloudEnabled',
      message: 'Would you like to enable Terraform Cloud?',
      default: false,
    },
  ]);

  if (terraformCloudPrompt.terraformCloudEnabled) {
    const terraformCloudOptions = await prompt([
      {
        type: 'input',
        name: 'terraformCloudOrganization',
        message: 'What is your Terraform Cloud organization?',
      },
      {
        type: 'input',
        name: 'terraformCloudWorkspace',
        message: 'What is your Terraform Cloud workspace?',
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
    terraformCloudWorkspace: '',
  };
};

const terraformCloudMainContent = (
  terraformCloudOptions: TerraformCloudOptions
) => dedent`
  cloud {
    organization = "${terraformCloudOptions.terraformCloudOrganization}"
    workspaces {
      name = "${terraformCloudOptions.terraformCloudWorkspace}"
    }
  }
`;

const applyTerraformCloud = async ({
  projectName,
}: GeneralOptions): Promise<void> => {
  const terraformCloudOptions = await getTerraformCloudOptions();

  if (terraformCloudOptions.terraformCloudEnabled) {
    [INFRA_CORE_MAIN_PATH, INFRA_SHARED_MAIN_PATH].forEach((path) => {
      injectToFile(
        path,
        terraformCloudMainContent(terraformCloudOptions),
        projectName,
        {
          insertAfter: 'terraform {',
        }
      );
    });
  }
};

export { applyTerraformCloud };
