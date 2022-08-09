import { GeneralOptions } from '../../../commands/generate';
import { copy } from '../../../helpers/file';

const versionControlChoices = [
  {
    type: 'list',
    name: 'versionControl',
    message: 'Enable version control for this project',
    choices: [
      {
        value: 'github',
        name: 'GitHub',
      },
    ],
  },
];

const applyVersionControl = (generalOptions: GeneralOptions): void => {
  const { versionControl, projectName } = generalOptions;

  if (versionControl === 'github') {
    copy('github', '.', projectName);
  }
};

export { versionControlChoices, applyVersionControl };
