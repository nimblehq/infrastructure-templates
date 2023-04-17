import { GeneralOptions } from '../../../commands/generate';
import { copy } from '../../../helpers/file';

const versionControlChoices = [
  {
    type: 'list',
    name: 'versionControl',
    message: 'Which Git hosting service you would like to use?',
    choices: [
      {
        value: 'github',
        name: 'GitHub',
      },
      {
        value: 'none',
        name: 'None',
      },
    ],
  },
];

const applyVersionControl = (generalOptions: GeneralOptions): void => {
  const { versionControl, projectName } = generalOptions;

  if (versionControl === 'github') {
    copy('addons/versionControl/github', '.', projectName);
  }
};

export { versionControlChoices, applyVersionControl };
