import { prompt } from 'inquirer';

import { GeneralOptions } from '@/commands/generate';
import { copy } from '@/helpers/file';

type VersionControlOptions = {
  versionControlEnabled: boolean;
  versionControlService: string;
};

const getVersionControlOptions = async (): Promise<VersionControlOptions> => {
  const versionControlPrompt = await prompt([
    {
      type: 'confirm',
      name: 'versionControlEnabled',
      message: 'Would you like to enable version control?',
      default: false,
    },
  ]);

  if (versionControlPrompt.versionControlEnabled) {
    const versionControlOptions = await prompt([
      {
        type: 'list',
        name: 'versionControlService',
        message: 'Which version control hosting would you like to use?',
        choices: [
          {
            name: 'GitHub',
            value: 'github',
          },
          {
            name: 'GitLab',
            value: 'gitlab',
            disabled: '(Coming soon)',
          },
        ],
      },
    ]);

    return {
      versionControlEnabled: true,
      ...versionControlOptions,
    };
  }

  return {
    versionControlEnabled: false,
    versionControlService: '',
  };
};

const applyVersionControl = async ({ projectName }: GeneralOptions) => {
  const versionControlOptions = await getVersionControlOptions();

  if (versionControlOptions.versionControlEnabled) {
    if (versionControlOptions.versionControlService === 'github') {
      copy('addons/versionControl/github', '.', projectName);
    }
  }
};

export { applyVersionControl };
