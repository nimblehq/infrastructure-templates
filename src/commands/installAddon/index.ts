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
    const { args, flags } = await this.parse(InstallAddon);

    const options: GeneralOptions = {
      projectName: flags.projectName,
      provider: flags.provider,
    };

    ux.info(
      `You are about to add \`${args.moduleName}\` module to \`${options.projectName}\` project`
    );

    switch (options.provider) {
      case 'aws':
        const awsOptions: AwsOptions = {
          ...options,
          awsRegion: 'ap-southeast-1',
        };

        await requireAWSModules(
          options.projectName,
          args.moduleName,
          awsOptions
        );

        break;
      default:
        this.error('This provider has not been implemented!');
    }
  }
}
