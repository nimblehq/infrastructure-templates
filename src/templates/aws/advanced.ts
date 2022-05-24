import * as dedent from 'dedent'
import {GenerateOption} from '../../commands/generate'
import {
  appendToFile,
  copyDir,
  copyFile,
  injectToFile,
} from '../../helpers/file'

export default class Advanced {
  options: GenerateOption;

  constructor(options: GenerateOption) {
    this.options = options
  }

  static run(options: GenerateOption): void {
    const advanced = new Advanced(options)
    advanced.applyTemplate()
  }

  private applyTemplate(): void {
    this.applyCommon()
    this.applyVPC()
  }

  private applyCommon(): void {
    copyFile('aws/main.tf', 'main.tf', this.options)
    copyFile('aws/outputs.tf', 'outputs.tf', this.options)
    copyFile('aws/variables.tf', 'variables.tf', this.options)
  }

  private applyVPC(): void {
    copyDir('aws/modules/vpc', 'modules/vpc', this.options)

    const vpcOutputContent = dedent`
    output "vpc_id" {
      description = "VPC ID"
      value       = "module.vpc.vpc_id"
    }`
    appendToFile('outputs.tf', vpcOutputContent, this.options)

    const vpcModuleContent = dedent`
    module "vpc" {
      source = "./modules/vpc"

      namespace   = var.app_name
      owner       = var.owner
      environment = var.environment
    }`

    injectToFile('main.tf', vpcModuleContent, {
      insertAfter: '# VPC',
      options: this.options,
    })
  }
}
