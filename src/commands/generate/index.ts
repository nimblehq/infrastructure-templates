import { Command } from '@oclif/core';
import * as inquirer from 'inquirer';

import Advanced from '../../templates/aws/advanced';

type GenerateOption = {
  projectName: string;
  platform: string;
  infrastructureType: string;
  awsRegion: string;
};

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

    const platformChoices = [
      {
        type: 'list',
        name: 'platform',
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

    const platformChoice = await inquirer.prompt(platformChoices);

    if (platformChoice.platform === 'aws') {
      const awsTypeChoices = [
        {
          type: 'list',
          name: 'infrastructureType',
          message: 'What kind of infrastructure do you need?',
          choices: [
            {
              key: 'basic',
              value: 'basic',
              name: 'Basic infrastructure (VPC + RDS + LOG + ECS)',
            },
            {
              key: 'advanced',
              value: 'advanced',
              name: 'Complete infrastructure (VPC + ECR + RDS + S3 + FARGATE + LOG + Security groups + ALB)',
            },
          ],
        },
        {
          type: 'input',
          name: 'awsRegion',
          default: 'ap-southeast-1',
          message: 'Which AWS Region do you choose?',
        },
      ];

      const awsUserInput = await inquirer.prompt(awsTypeChoices);

      const options: GenerateOption = {
        projectName: args.projectName,
        platform: platformChoice.platform,
        infrastructureType: awsUserInput.infrastructureType,
        awsRegion: awsUserInput.awsRegion,
      };

      switch (options.infrastructureType) {
        case 'advanced':
          Advanced.run(options);
          this.log('The infrastructure has been generated!');

          break;
        case 'basic':
        default:
          this.log('This type has not been implemented!');
      }
    } else {
      this.log('This provider has not been implemented!');
    }
  }
}

export type { GenerateOption };
