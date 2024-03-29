import { Args, Command, ux } from '@oclif/core';
import { prompt } from 'inquirer';

import { generateAwsTemplate } from '@/generators/addons/aws';
import { applyTerraformCloud } from '@/generators/addons/terraformCloud';
import { applyVersionControl } from '@/generators/addons/versionControl';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';
import { postProcess } from '@/hooks/postProcess';

type GeneralOptions = {
  projectName: string;
  provider: 'aws' | 'other' | string;
};

const providerChoices = [
  {
    type: 'list',
    name: 'provider',
    message: 'Which cloud provider would you like to use? [AWS]',
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

    const generalPrompt = await prompt<GeneralOptions>([...providerChoices]);
    const projectName = args.projectName.toLowerCase().replace(/\s/g, '-');
    const generalOptions: GeneralOptions = {
      projectName: projectName,
      provider: generalPrompt.provider,
    };

    await this.generate(generalOptions);
    await postProcess(generalOptions);

    ux.info(
      `The infrastructure code was generated at '${generalOptions.projectName}'`
    );
  }

  private async generate(generalOptions: GeneralOptions) {
    try {
      await this.applyGeneralParts(generalOptions);

      switch (generalOptions.provider) {
        case 'aws':
          await generateAwsTemplate(generalOptions);

          break;
        default:
          ux.error('This provider has not been implemented!');
      }
    } catch (error) {
      remove('/', generalOptions.projectName);

      let message = 'Unknown Error';
      if (error instanceof Error) message = error.message;

      ux.error(message);
    }
  }

  private async applyGeneralParts(generalOptions: GeneralOptions) {
    await applyTerraformCore(generalOptions);
    await applyTerraformCloud(generalOptions);
    await applyVersionControl(generalOptions);
  }
}

export type { GeneralOptions };
