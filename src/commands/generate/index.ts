import {Command, Flags} from '@oclif/core'
import * as inquirer from 'inquirer'

export default class Hello extends Command {
  static description = 'Generate'

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
          type: 'input',
          name: 'organization',
          message: "What's your organization name?",
          validate: (answer:any) => {
            if (!answer) {
              return 'Please input the organization name.'
            }

            return true
          },
        },
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

      console.log(infrastructureType)
    }
  }
}
