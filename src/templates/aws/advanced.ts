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

      namespace   = var.namespace
    }`

    injectToFile('main.tf', vpcModuleContent, {
      insertAfter: '# VPC',
      options: this.options,
    })
  }

  private applyS3(): void {
    copyDir('aws/modules/s3', 'modules/s3', this.options)

    const s3OutputContent = dedent`
    output "s3_alb_log_bucket_name" {
      description = "S3 bucket name for ALB log"
      value       = "module.s3.aws_alb_log_bucket_name"
    }
    `

    appendToFile('outputs.tf', s3OutputContent, this.options)

    const s3ModuleContent = dedent`
    module "vpc" {
      source = "./modules/s3"

      namespace   = var.namespace
    }`

    injectToFile('main.tf', s3ModuleContent, {
      insertAfter: '# S3',
      options: this.options,
    })
  }
}
