import {Command} from '@oclif/core'
import * as inquirer from 'inquirer'
import Advanced from '../../templates/aws/advanced'

type GenerateOption = {
  projectName: string;
  platform: string;
  infrastructureType: string;
};

export default class Hello extends Command {
  static description = 'Generate infrastructure template command'

  static examples = [
    '$ nimble-infra generate',
  ]

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
    const {args} = await this.parse(Hello)

    const questions = [
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
    ]

    const platformChoice = await inquirer.prompt(questions)

    if (platformChoice.platform === 'aws') {
      const questions = [
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
              name: 'Complete infrastructure (VPC + RDS + S3 + FARGATE + LOG + Security groups + ALB)',
            },
          ],
        },
      ]

      const infrastructureType = await inquirer.prompt(questions)

      const options: GenerateOption = {
        projectName: args.projectName,
        platform: platformChoice.platform,
        infrastructureType: infrastructureType.infrastructureType,
      }

      switch (options.infrastructureType) {
      case 'advanced':
        Advanced.run(options)
        break
      case 'basic':
      default:
        console.log('This type has not been implemented!')
        break
      }
    }
  }
}

export type {GenerateOption}
