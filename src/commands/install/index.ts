import { Args, Flags, Command, ux } from '@oclif/core';
import { prompt } from 'inquirer';

import { requireAwsModules } from '@/generators/addons/aws/dependencies';
import { awsModules } from '@/generators/terraform/types';
import { postProcess } from '@/hooks/postProcess';

import { GeneralOptions } from '../generate';

export default class InstallAddon extends Command {
  static description = 'Install additional modules';
  static examples = ['$ nimble-infra install [module]'];
  static usage = 'install [module] [options]';
  static aliases = ['add', 'install'];

  static flags = {
    provider: Flags.string({
      required: true,
      description: 'Provider name',
      char: 'p',
      default: 'aws',
      options: ['aws'],
    }),
    project: Flags.string({
      required: true,
      description: 'Project name',
      default: '.',
    }),
  };

  static args = {
    moduleName: Args.string({
      description: 'AWS module name',
      options: [...awsModules],
    }),
  };

  async run(): Promise<void> {
    try {
      const { args, flags } = await this.parse(InstallAddon);

      let moduleNameOption;
      const options: GeneralOptions = {
        projectName: flags.project,
        provider: flags.provider,
      };

      switch (options.provider) {
        case 'aws':
          if (typeof args.moduleName === 'string') {
            moduleNameOption = args.moduleName;
          } else {
            moduleNameOption = await this.getAWSModuleNameOption();
          }

          await this.applyModule(moduleNameOption, options);

          break;
        default:
          this.error('This provider has not been implemented!');
      }

      await postProcess(options);

      const projectName =
        options.projectName === '.' ? 'current' : options.projectName;

      ux.info(
        `The '${moduleNameOption}' module has been installed to '${projectName}' project successfully!`
      );
    } catch (error: any) { // eslint-disable-line
      ux.info(error.message);
    }
  }

  private async getAWSModuleNameOption() {
    const moduleNameOptions = awsModules.map((module) => ({
      name: module,
      value: module,
    }));

    const moduleNamePrompt = await prompt([
      {
        type: 'list',
        name: 'moduleName',
        message: 'Which AWS module would you like to install?',
        choices: moduleNameOptions,
      },
    ]);

    return moduleNamePrompt.moduleName;
  }

  private async applyModule(moduleName: string, options: GeneralOptions) {
    await requireAwsModules(options.projectName, moduleName, options, {
      skipConfirmation: true,
    });
  }
}
