import { Command } from '@oclif/core';
import { prompt } from 'inquirer';

import { getProjectPath, remove } from '../../helpers/file';
import { detectTerraform, formatCode } from '../../helpers/terraform';
import { applyTerraform } from '../../templates/addons/terraform';
import {
  applyVersionControl,
  versionControlChoices,
} from '../../templates/addons/versionControl';
import { generateAwsTemplate } from '../../templates/aws';

type GeneralOptions = {
  projectName: string;
  versionControl?: 'github' | 'none';
  provider: 'aws' | 'other';
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

    const generalPrompt = await prompt<GeneralOptions>([
      ...versionControlChoices,
      ...providerChoices,
    ]);
    const generalOptions: GeneralOptions = {
      projectName: args.projectName,
      provider: generalPrompt.provider,
      versionControl: generalPrompt.versionControl,
    };

    try {
      this.applyCore(generalOptions);

      switch (generalOptions.provider) {
        case 'aws':
          await generateAwsTemplate(generalOptions);

          break;
        default:
          this.error('This provider has not been implemented!');
      }

      await this.postProcess(generalOptions);

      this.log('The infrastructure has been generated!');
    } catch (error) {
      remove('/', generalOptions.projectName);
      console.error(error);
    }
  }

  private applyCore(generalOptions: GeneralOptions): void {
    applyTerraform(generalOptions);
    applyVersionControl(generalOptions);
  }

  private async postProcess(generalOptions: GeneralOptions): Promise<void> {
    try {
      if (await detectTerraform()) {
        await formatCode(getProjectPath(generalOptions.projectName));
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export type { GeneralOptions };
