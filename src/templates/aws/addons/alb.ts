import { dedent } from 'ts-dedent';

import { AwsOptions } from '..';
import { appendToFile, copy } from '../../../helpers/file';
import {
  AWS_SECURITY_GROUP_MAIN_PATH,
  AWS_SECURITY_GROUP_OUTPUTS_PATH,
  INFRA_BASE_MAIN_PATH,
  INFRA_BASE_OUTPUTS_PATH,
  INFRA_BASE_VARIABLES_PATH,
} from '../../core/constants';

const albVariablesContent = dedent`
  variable "health_check_path" {
    description = "Application health check path"
    type = string
  }

  variable "domain" {
    description = "Application domain"
    type        = string
  }

  variable "enable_alb_stickiness" {
    description = "Enable sticky sessions for ALB"
    type        = bool
    default     = false
  }

  variable "alb_stickiness_type" {
    description = "ALB stickiness type"
    type        = string
    default     = "lb_cookie"
  }`;

const albModuleContent = dedent`
  module "alb" {
    source = "../modules/alb"

    vpc_id             = module.vpc.vpc_id
    namespace          = var.namespace
    app_port           = var.app_port
    subnet_ids         = module.vpc.public_subnet_ids
    security_group_ids = module.security_group.alb_security_group_ids
    health_check_path  = var.health_check_path
    enable_stickiness  = var.enable_alb_stickiness
    stickiness_type    = var.alb_stickiness_type
  }`;

const albOutputsContent = dedent`
  output "alb_dns_name" {
    description = "ALB DNS"
    value       = module.alb.alb_dns_name
  }`;

const albSGMainContent = dedent`
  resource "aws_security_group" "alb" {
    name        = "\${var.namespace}-alb-sg"
    description = "ALB Security Group"
    vpc_id      = var.vpc_id

    tags = {
      Name = "\${var.namespace}-alb-sg"
    }
  }

  resource "aws_security_group_rule" "alb_ingress_https" {
    type              = "ingress"
    security_group_id = aws_security_group.alb.id
    protocol          = "tcp"
    from_port         = 443
    to_port           = 443
    cidr_blocks       = ["0.0.0.0/0"]
  }

  resource "aws_security_group_rule" "alb_ingress_http" {
    type              = "ingress"
    security_group_id = aws_security_group.alb.id
    protocol          = "tcp"
    from_port         = 80
    to_port           = 80
    cidr_blocks       = ["0.0.0.0/0"]
  }

  resource "aws_security_group_rule" "alb_egress" {
    type              = "egress"
    security_group_id = aws_security_group.alb.id
    protocol          = "tcp"
    from_port         = var.app_port
    to_port           = var.app_port
    cidr_blocks       = ["0.0.0.0/0"]
  }`;

const albSGOutputsContent = dedent`
  output "alb_security_group_ids" {
    description = "Security group IDs for ALB"
    value       = [aws_security_group.alb.id]
  }`;

const applyAlb = ({ projectName }: AwsOptions) => {
  copy('aws/modules/alb', 'modules/alb', projectName);
  appendToFile(INFRA_BASE_MAIN_PATH, albModuleContent, projectName);
  appendToFile(INFRA_BASE_VARIABLES_PATH, albVariablesContent, projectName);
  appendToFile(INFRA_BASE_OUTPUTS_PATH, albOutputsContent, projectName);
  appendToFile(AWS_SECURITY_GROUP_MAIN_PATH, albSGMainContent, projectName);
  appendToFile(
    AWS_SECURITY_GROUP_OUTPUTS_PATH,
    albSGOutputsContent,
    projectName
  );
};

export default applyAlb;
export {
  albVariablesContent,
  albModuleContent,
  albOutputsContent,
  albSGMainContent,
  albSGOutputsContent,
};
