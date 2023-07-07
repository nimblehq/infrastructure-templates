import { Args, Command } from '@oclif/core';
import { prompt } from 'inquirer';

import { getProjectPath, remove } from '../../helpers/file';
import { detectTerraform, formatCode } from '../../helpers/terraform';
import {
  applyVersionControl,
  versionControlChoices,
} from '../../templates/addons/versionControl';
import { generateAwsTemplate } from '../../templates/aws';
import { applyCore } from '../../templates/core';

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

  static args = {
    projectName: Args.string({
      required: true,
      description: 'Directory name of new project',
      default: '.',
    }),
  };

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
      this.applyGeneralParts(generalOptions);

      switch (generalOptions.provider) {
        case 'aws':
          await generateAwsTemplate(generalOptions);

          break;
        default:
          this.error('This provider has not been implemented!');
      }

      await this.postProcess(generalOptions);

      this.log(
        `The infrastructure code was generated at '${generalOptions.projectName}'`
      );
    } catch (error) {
      remove('/', generalOptions.projectName);
      console.error(error);
    }
  }

  private applyGeneralParts(generalOptions: GeneralOptions): void {
    applyCore(generalOptions);
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
