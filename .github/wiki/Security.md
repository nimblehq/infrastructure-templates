# Security

This document provides an overview of the security modules available in the infrastructure templates to help enhance your AWS infrastructure security posture.

## Available Security Modules

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

