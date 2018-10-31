# Heroku via Terraform

This Terraform template corresponds to the setup that we have for most of the applications that we develop and host on Heroku. The goal is to be able to spin up a new Heroku project (including staging and production) in 10 minutes.

## Prerequisites

Before getting started, please make sure that you have the following tools installed and ready.

- [Heroku CLI](https://devcenter.heroku.com/categories/command-line)
- [Terroform CLI](https://www.terraform.io/downloads.html)
- [Vault](https://www.vaultproject.io/downloads.html) (optional)

## Getting Started

1. Clone this repository
2. Copy the `heroku` directory in your project's root

### Logging Into Heroku

For all Terraform operations you will need to talk to Heroku. To talk to Heroku, you need to be logged in.

```bash
  $ heroku login
```

#### Exporting Your Heroku Credentials

To avoid having to provide your Heroku email and token for every operation, you want to export your credentials. Terraform will automatically pick them up and won't ask for any authentication for the duration of your session.

```bash
  $ export TF_VAR_heroku_email=`heroku auth:whoami`
  # This token will last for 5 mins (300sec) only
  $ export TF_VAR_heroku_token=`heroku authorizations:create -S -e 300`
```

### Setting Your Application's Name

There aren't many things to change in the template before you can apply it and spin up your apps.

One of the changes that you **must do** is set the application's name.

Please note that the environment will be appended to the application name based on your workspace. More on that later.

1. Open `variables.tf`
2. Find the `app_name` block
3. Change the value of `default` (`nimbl3-terra-app` in this template) to your application's name

### Checking Your Variables

This template comes with the following components:

- One Heroku app
- Addons
  + Sentry
  + Postgres
  + Redis

If you need to customize the app's configuration, open the `variables.tf` file and add more addons as you please. More details about the Heroku addons are available here: [https://www.terraform.io/docs/providers/heroku/r/addon.html.](https://www.terraform.io/docs/providers/heroku/r/addon.html)

### Initializing Terraform

You are now ready to initialize your Terraform configuration.

Before going any further, you need to generate the Terraform state. This is where Terraform saves your entire configuration. It's a version control of sorts for your architecture.

Terraform's state is saved inside the `.terraform` directory. **You must commit this directory to your project's Git repository.**

### Setting Up Your Workspaces

[Terraform's Workspaces](https://www.terraform.io/docs/state/workspaces.html) allow you to define variations of the same configuration.

With this template, it means that you are able to spin up multiple versions of the app with the addons listed in the previous section.

This is ideal for creating the `staging` and `production` environments.

#### Listing Workspaces

You can always see what workspaces exist for your project.

```
$ terraform workspace list
```

This will show you the list of all your workspaces and it will highlight which workspace is the one you're currently working under.

![][flavor_list]

#### Changing Workspaces

To switch from one workspace to an other (e.g. changing from staging to production) you can run the following.

```
$ terraform workspace select {workspace_name}
```

#### Creating a Workspace

After initializing the Terraform project, you will automatically be in the `default` workspace.

**Note:** the workspace name is used to generate the app's name on Heroku. For instance, if your app's name is `test` and your current workspace is `default`, the Heroku app will be called `test-default`.

To create a new workspace, you can run the following.

```
$ terraform workspace new {workspace_name}
```

To follow our usual architecture setup, you will need to create two workspaces: `staging` and `production`.

This will result in the creation of two Heroku apps: `test-staging` and `test-production`.

It means that you should be running the following commands:

```
$ terraform workspace new staging
$ terraform workspace new production
```

## Planning Terraforms

Whenever a change is made to the configuration, you should be checking the result by using Terraform's "plan" feature.

This will list all the changes that would be made to your server(s) and addons should you apply the current configuration.

```
$ terraform plan
```

## Applying Terraforms

Now that you have configured your architecture via the Terraform configuration you're ready to apply it. Applying the Terraform config will execute all that's been define previously: creating the apps and provisioning the addons.

### Results

#### Staging
  
![][staging]

#### Production
    
![][production]

#### On Heroku

## Nifty Checklist

I know, that's a long list of instruction up here. To make sure you're not forgetting anything, make sure you check all the boxes below when setting up your Terraform project.

- [ ] (Optional) Log into Heroku CLI
- [ ] (Optional) Export your Heroku credentials
- [ ] Set your application's name
- [ ] Check (update if necessary) the project variables
- [ ] Initialize Terraform
- [ ] Create the `staging` workspace
- [ ] Create the `production` workspace
- [ ] Plan and confirm `staging`
- [ ] Apply `staging`
- [ ] Plan and confirm `production`
- [ ] Apply `production`

![][app_flavors]

[flavor_list]: <screenshots/flavor_list.png>
[app_flavors]: <screenshots/app_flavors.png>
[staging]:<screenshots/staging_created.png>
[production]:<screenshots/production_created.png>