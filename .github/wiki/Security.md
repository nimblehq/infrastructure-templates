# Security

This document provides an overview of the security modules available in the infrastructure templates to help enhance your AWS infrastructure security posture.

## Available Security Modules

### CloudTrail

The CloudTrail module provides comprehensive API activity logging and monitoring for your AWS infrastructure to enhance security auditing and compliance.

#### Overview

AWS CloudTrail records API calls and events across your AWS account. This module:

- **Comprehensive event logging**: Captures management events, data events, and insight events based on configuration
- **Multi-region support**: Can be configured to log events across all AWS regions for complete visibility
- **CloudWatch integration**: Sends logs to CloudWatch for real-time monitoring and alerting
- **SNS notifications**: Integrates with SNS topics for immediate alerting on critical events
- **S3 storage**: Stores all CloudTrail logs securely in Amazon S3 with configurable key prefix organization

### VPC Flow Log

The VPC Flow Log module captures network traffic information in your VPC to help with security monitoring and network analysis.

#### Overview

VPC Flow Logs capture information about IP traffic going to and from network interfaces in your VPC. This module:

- **Captures network flows**: Records detailed information about network traffic patterns in your VPC
- **Stores logs in S3**: Saves all captured flow logs securely in an Amazon S3 bucket with configurable retention
- **Enables querying via Athena**: Provides ready-to-use AWS Athena integration for analyzing log data using SQL queries

## Getting Started

To add security features to your infrastructure:

1. Run the infrastructure generator
2. Select "Complete infrastructure (VPC + ECR + RDS + S3 + FARGATE + Cloudwatch + Security groups + ALB)" when prompted for infrastructure type
3. Choose "Yes" when asked "Do you want to create (VPC Flow Logs + CloudTrail) to enhance security posture and compliance?"
