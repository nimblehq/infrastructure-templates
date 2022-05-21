import {Command} from '@oclif/core'
import * as inquirer from 'inquirer'

export default class Generator extends Command {
  static description = 'Generate infrastructure template command'

  static examples = [
    `$ nimble-infra generate
    `,
  ]

  static flags = {}

  static args = []

  async run(): Promise<void> {
    const questions = [
      {
        type: 'list',
        name: 'platform',
        message: 'What cloud provider you would like to use?',
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
          message: 'What kind of infrastructure you need?',
          choices: [
            {
              key: 'basic',
              value: 'basic',
              name: 'Basic infrastructure (VPC + RDS + LOG + ECS)',
            },
            {
              key: 'advance',
              value: 'advance',
              name: 'Complete infrastructure (VPC + RDS + LOG + S3 + FARGATE + LOG + Security groups + ALB)',
            },
          ],
        },
      ]

      const infrastructureType = await inquirer.prompt(questions)

      console.log(infrastructureType, platformChoice)
    }
  }
}
