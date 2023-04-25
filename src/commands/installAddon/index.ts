import { Args, Flags, Command, ux } from '@oclif/core';

import { AwsOptions } from '@/templates/aws';
import { requireAWSModules } from '@/templates/core/dependencies';
import { awsModules } from '@/templates/core/types';

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
    projectName: Flags.string({
      required: true,
      description: 'Project name',
      default: '.',
    }),
  };

  static args = {
    moduleName: Args.string({
      required: true,
      description: 'Module name',
      options: [...awsModules],
    }),
  };

  async run(): Promise<void> {
    try {
      const { args, flags } = await this.parse(InstallAddon);

      const options: GeneralOptions = {
        projectName: flags.projectName,
        provider: flags.provider,
      };

      const projectName =
        options.projectName === '.' ? 'current' : options.projectName;
      switch (options.provider) {
        case 'aws':
          const awsOptions: AwsOptions = {
            ...options,
            awsRegion: 'ap-southeast-1',
          };

          await requireAWSModules(
            options.projectName,
            args.moduleName,
            awsOptions,
            { skipConfirmation: true }
          );

          break;
        default:
          this.error('This provider has not been implemented!');
      }

      ux.info(
        `The \`${args.moduleName}\` module has been installed to \`${projectName}\` project successfully!`
      );
    } catch (error) {
      let message = 'Unknown Error';
      if (error instanceof Error) message = error.message;

      ux.error(message);
    }
  }
}
