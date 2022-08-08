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
      {
        value: 'gitlab',
        name: 'GitLab (NOT IMPLEMENTED YET)',
        disabled: true,
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
