import { Command } from '@oclif/core';
import { prompt } from 'inquirer';

import { getTargetDir } from '../../helpers/file';
import { detectTerraform, formatCode } from '../../helpers/terraform';
import Aws from '../../templates/aws';

type GeneralOptions = {
  projectName: string;
  provider: string;
};

const providerChoices = [
  {
    type: 'list',
    name: 'provider',
    message: 'Which cloud provider would you like to use?',
    choices: [
      {
        value: 'aws',
        name: 'AWS',
      },
      {
        value: 'gcp',
        name: 'GCP',
      },
      {
        value: 'heroku',
        name: 'Heroku',
      },
    ],
  },
];

export default class Generator extends Command {
  static description = 'Generate infrastructure template command';

  static examples = ['$ nimble-infra generate'];

  static flags = {};

  static args = [
    {
      name: 'projectName',
      required: true,
      description: 'directory name of new project',
      default: '.',
    },
  ];

  async run(): Promise<void> {
    const { args } = await this.parse(Generator);

    const providerPrompt = await prompt(providerChoices);
    const generalOptions: GeneralOptions = {
      projectName: args.projectName,
      provider: providerPrompt.provider,
    };

    try {
      switch (generalOptions.provider) {
        case 'aws':
          await new Aws(generalOptions).run();
          break;
        case 'gcp':
        case 'heroku':
        default:
          this.error('This provider has not been implemented!');
      }

      await this.postProcess(generalOptions);

      this.log('The infrastructure has been generated!');
    } catch (error) {
      this.error(error as Error);
    }
  }

  private async postProcess(generalOptions: GeneralOptions): Promise<void> {
    if (await detectTerraform()) {
      formatCode(getTargetDir(generalOptions.projectName));
    }
  }
}

export type { GeneralOptions };
