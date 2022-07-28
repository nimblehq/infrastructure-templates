# Nimble Infrastructure Template

An infrastructure template for web applications, and powered by Terraform.

**Supported cloud:** AWS. We are looking for contributions to implement support for GCP, Heroku and Azure!

**Supported flavors:**
- A `Basic` flavor is in the plan, but not available yet
- The `Complete` flavor generates the following infrastructure:

![Diagram of the Complete Infrastructure](https://github.com/nimblehq/infrastructure-templates/blob/feature/55-add-documentation/img/diagram_complete.png?raw=true)

# Usage

## Generate a new project

```bash
npm install -g @nimblehq/infra-template

nimble-infra generate {project-name}
```

or

```bash
npx @nimblehq/infra-template generate {project-name}
```

## Deploy your infrastructure

You can deploy your infrastructure with the [terraform CLI](https://learn.hashicorp.com/collections/terraform/cli) (`brew install terraform`), or directly using the [Terraform Cloud](https://cloud.hashicorp.com/products/terraform).

This template remains generic to provide more flexibility.
A workspace and folder strategy needs to be defined first:
What workspaces will you need?
What needs to be global versus specific to an environment?

While advanced users won't need it, the next part provides a "starter kit" architecture that suits most of the projects.

## Starter kit

> TODO: High level description of the starter kit

### Step 1, Source Code

In the source code:
- create a `base` and a `shared` folder.
- move the `main.tf`, `outputs.tf` and `variables.tf` into the `base` folder.
- create 3 empty files (`main.tf`, `outputs.tf` and `variables.tf`) in the `shared` folder
- extract from the `base/*` files all data related to `ECR`

### Step 2, AWS Access Key

For Terraform to push your changes into AWS, it needs an access key. There are 2 options for that:
- Using Terraform Cloud: configure the `aws_access_key` and `aws_secret_key` as sensitive variables in your TF Cloud Workspaces. Then add the reference into the source code:
  ```
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
- Using the `terraform` cli: You first need to install the `aws` CLI. Then run `aws configure` and enter your keys when prompt.
  Note that this will store your key unencrypted in your file system. You want to ensure your workstation has an encrypted disk and strong password!

### Step 3: workspaces

_Workspaces can be managed in the terraform cloud or using the CLI._

- Create a workspace named `{project-slug}-shared`
  - Map it to the repository
  - In the advanced configuration, ensure to configure your `VCS branch` with your current Git branch and the `Terraform Working Directory` as `shared`
  - A list of variables (parsed from your source code) is available for input immediately. It does not enable inputting "sensitive" variables, so consider adding the sensitive variables later.
  - Once done, navigate to the workspace homepage, then the "Variables" tab. Add the missing variables if any.
  - You can now `Plan`, and, if successful, `Apply` the configuration in this workspace. The ECR should be created in AWS!
- Create a workspace named `{project-slug}-staging`
  - Follow the same steps, but this time, configure the `Terraform Working Directory` as `base`
  - When inputting the variables, adjust the `namespace` and `environment` with the `-staging` suffix.
- Last, create the `{project-slug}-prod` workspace. It is similar to the `{project-slug}-staging` workspace but use the `-prod` suffix instead of the `-staging` one.

> Other variables might change from `staging` to `prod`, such as the DB credentials. Consider reviewing all the available variables and their descriptions.

## Add environment Variables

> TODO: Describe how to add env variables using the file `service.json.tftpl` in the ECS module.

## License

This project is Copyright (c) 2014 and onwards Nimble. It is free software and may be redistributed under the terms specified in the [LICENSE] file.

[LICENSE]: /LICENSE

## About

![Nimble](https://assets.nimblehq.co/logo/dark/logo-dark-text-160.png)

This project is maintained and funded by Nimble.

We ❤️ open source and do our part in sharing our work with the community!
See [our other projects][community] or [hire our team][hire] to help build your product.

[community]: https://github.com/nimblehq
[hire]: https://nimblehq.co/
