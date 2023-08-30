## Deploy your infrastructure

You can deploy your infrastructure with the [terraform CLI](https://learn.hashicorp.com/collections/terraform/cli) (`brew install terraform`), or directly using the [Terraform Cloud](https://cloud.hashicorp.com/products/terraform).

This template remains generic to provide more flexibility.
A workspace and folder strategy needs to be defined first:

- What resources need to be global?
- What resources need to be specific to an environment?
- What workspaces will you need?

While advanced users won't need it, the next part provides a "starter kit" architecture that suits most of the new projects.

## Starter kit

The starter kit has 3 workspaces:

- **Shared**: Handles a single ECR (Elastic Container Registry) for the whole infrastructure
- **Staging** and **Prod**: Both workspaces are similar but use different resource names (using the suffixes `-staging` and `-prod`)

### Step 1, Source Code

In the source code:

- create a `base` and a `shared` folder.
- move the `main.tf`, `outputs.tf` and `variables.tf` into the `base` folder.
- create 3 empty files (`main.tf`, `outputs.tf` and `variables.tf`) in the `shared` folder.
- extract from the `base/*` files all data related to `ECR`.

### Step 2, AWS Access Key

For Terraform to push your changes into AWS, it needs an access key. There are 2 options for that:

- Using Terraform Cloud: configure the `aws_access_key` and `aws_secret_key` as sensitive variables in your Terraform Cloud Workspaces. Then add the reference into the source code:

  ```hcl
  // base/main.tf && shared/main.tf
  provider "aws" {
    region     = var.region
    access_key = var.aws_access_key // To be added
    secret_key = var.aws_secret_key // To be added

    default_tags {
      tags = {
        Environment = var.environment
        Owner       = var.owner
      }
    }
  }
  ```

- Using the Terraform CLI: You first need to install the AWS CLI. Then run `aws configure` and enter your keys when prompted.
  Note that this will store your key unencrypted in your file system. You want to ensure your workstation has an encrypted disk and a strong password!

### Step 3: workspaces

_Workspaces can be managed in the Terraform cloud or using the CLI._

- Create a workspace named `{project-slug}-shared`
  - Map it to the repository
  - In the advanced configuration, ensure to configure your `VCS branch` with your current Git branch and the `Terraform Working Directory` as `shared`
  - A list of variables (parsed from your source code) is available for input immediately. It does not enable inputting "sensitive" variables, so consider adding the sensitive variables later.
  - Once done, navigate to the workspace homepage, then the "Variables" tab. Add the missing variables if any.
  - You can now `Plan`, and, if successful, `Apply` the configuration in this workspace. The ECR should be created in AWS!
- Create a workspace named `{project-slug}-staging`
  - Follow the same steps, but this time, configure the `Terraform Working Directory` as `base`
  - When inputting the variables, adjust the `namespace` and `environment` with the `-staging` suffix.
- Last, create the `{project-slug}-prod` workspace. Follow the steps for the `{project-slug}-staging` workspace but use the `-prod` suffix instead of the `-staging` one.

> [!NOTE]\
> Other variables might change from `staging` to `prod`, such as the DB credentials. Consider reviewing all the available variables and their descriptions.

### Step 4: Environment Variables and Secrets

To provision a new environment variable, it needs to be configured in the Terraform workspace.

> [!NOTE]\
> Editing the environment variables requires planning and applying changes in the Terraform project.

#### Non Sensitive Variable

Non-sensitive variables do not require code changes in the `*-infra` project.

Edit the variable named `environment_variables` directly in the Terraform Cloud workspace.
This variable is an object and it can be extended just by editing its content and appending a new item to it.

Example of the `environment_variables` object as displayed in Terraform:

```hcl
[
  {
    name = "AVAILABLE_LOCALES"
    value = "en,th"
  },
  {
    name = "DEFAULT_LOCALE"
    value = "th"
  },
  {
    name = "FALLBACK_LOCALES"
    value = "th"
  }
]
```

#### Sensitive Variable

When a variable is set to sensitive, its content cannot be read by users once saved.
So extending an object is not possible for sensitive variables — unless adding a lot of complexity.

The below steps describe how to add a new sensitive environment variable with the name `MY_NEW_VAR`.

First, edit the `*-infra` source code:

- Declare a new variable in `base/variables.tf` with the name `my_new_var`
- Edit the `base/main.tf` file, add the name of the variable under the `secrets` section in the `ssm` module:

  ```terraform
  module "ssm" {
    source = "../modules/ssm"

    namespace = var.namespace

    secrets = {
      secret_key_base = var.secret_key_base,
      my_new_var      = var.my_new_var
    }
  }
  ```

Then add the variable in the Terraform workspace.
The variable shall be marked as "sensitive" to ensure its value will not be available within logs.

Once the variable is added and the code pushed, run a Terraform plan.
The plan results should indicate the creation of the new variable.
Apply the plan if it ran successfully.

The new variable `MY_NEW_VAR` will be available in the ECS task definition.

#### Update existing variables

- To update an existing variable, edit the variable in the Terraform workspace:
- If the variable is not sensitive, edit the `environment_variables` object.
- If the variable is sensitive, edit the variable directly in the Terraform workspace.
- Once the variable is updated, run a Terraform plan and apply it if it ran successfully.

> [!NOTE]\
> Re-deploying the application is required when updating sensitive variables.

### Step 5: Adjust the ALB Target Group Health Check to your need

The default settings for the Application Load Balancer Target Group health check are:

- interval: every 5 seconds
- timeout: 3 seconds
- 2 consecutive failed checks will mark the task as failed and will trigger a rollback

This suits well applications that are quickly up and running (e.g., static website, Go Gin app, ...).
If your application load time is slower (e.g., Ruby on Rails), consider reviewing these numbers for longer timeout and interval.
For example, given the application requires 40 seconds to load, using a 60 seconds interval and a 30 seconds timeout would provide a recovery time of 2 minutes (2 failed checks) while avoiding unwanted rollbacks after deploying a new version.

## License

This project is Copyright (c) 2014 and onwards Nimble. It is free software and may be redistributed under the terms specified in the [LICENSE] file.

[LICENSE]: /LICENSE

## About

![Nimble](https://assets.nimblehq.co/logo/dark/logo-dark-text-160.png)

This project is maintained and funded by Nimble.

We ❤️ open source and do our part in sharing our work with the community!
See [our other projects][community] or [hire our team][hire] to help build your product.
Want to join? [Check out our jobs][jobs]!

[community]: https://github.com/nimblehq
[hire]: https://nimblehq.co/
[jobs]: https://jobs.nimblehq.co/
