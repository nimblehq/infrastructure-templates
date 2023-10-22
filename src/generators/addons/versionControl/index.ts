import { prompt } from 'inquirer';

import { GeneralOptions } from '@/commands/generate';
import { copy } from '@/helpers/file';

type VersionControlOptions = {
  versionControlService: 'github' | 'gitlab' | 'none';
};

const getVersionControlOptions = async (): Promise<VersionControlOptions> => {
  const versionControlOptions = await prompt([
    {
      type: 'list',
      name: 'versionControlService',
      message: 'Which version control service would you like to use?',
      choices: [
        {
          name: 'GitHub',
          value: 'github',
        },
        {
          name: 'GitLab',
          value: 'gitlab',
          disabled: 'Coming soon',
        },
        {
          name: 'None',
          value: 'none',
        },
      ],
    },
  ]);

  return versionControlOptions;
};

const applyVersionControl = async ({ projectName }: GeneralOptions) => {
  const versionControlOptions = await getVersionControlOptions();

  if (versionControlOptions.versionControlService === 'github') {
    copy('addons/versionControl/github', '.', projectName);
  }
};

export { applyVersionControl };
