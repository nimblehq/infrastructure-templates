import { prompt } from 'inquirer';

import { GeneralOptions } from '@/commands/generate';
import { copy } from '@/helpers/file';

type VersionControlOptions = {
  enabled: boolean;
  versionControlService: string;
};

const getVersionControlOptions = async (): Promise<VersionControlOptions> => {
  const versionControlPrompt = await prompt([
    {
      type: 'confirm',
      name: 'enabled',
      message: 'Would you like to enable version control?',
      default: false,
    },
  ]);

  if (versionControlPrompt.enabled) {
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
      enabled: true,
      ...versionControlOptions,
    };
  }

  return {
    enabled: false,
    versionControlService: '',
  };
};

const applyVersionControl = async ({ projectName }: GeneralOptions) => {
  const versionControlOptions = await getVersionControlOptions();

  if (versionControlOptions.enabled) {
    if (versionControlOptions.versionControlService === 'github') {
      copy('addons/versionControl/github', '.', projectName);
    }
  }
};

export { applyVersionControl };
