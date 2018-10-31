### Using Terraform to spin up Heroku with pre-installed plugins

### Pre-condition:
Having these installed:
- [Heroku CLI](https://devcenter.heroku.com/categories/command-line)
- [Terroform CLI](https://www.terraform.io/downloads.html)
- [Vault](https://www.vaultproject.io/downloads.html) (optional)

### Steps:
- Clone this repository
- cd to this /heroku directory
- Review the `variables.tf` to check for your desire setup like: app's name, add-ons, plans...make adjustment according to your expectation.
- Login to Heroku:

```bash
  $ heroku login
```

- After successfully login, generate a short term Heroku Email & Token and export them for our usage:

```bash
  $ export TF_VAR_heroku_email=`heroku auth:whoami`
  # This token will last for 5 mins (300sec) only
  $ export TF_VAR_heroku_token=`heroku authorizations:create -S -e 300`
```

- Configuring application flavor: usually we have `staging` and `production` flavor, so, to separate the setup we are using [Workspace](https://www.terraform.io/docs/state/workspaces.html) to differentiate the 2 different setup state.
    - To create `staging` flavor, run : `$ terraform workspace new staging`
    - To create `production` flavor, run: `$ terraform workspace new production`
    - To switch between the context, for example switch back to Staging, run: `$ terraform workspace select staging`
    - The flavor name will be appended to the default application name and its add-ons from now on, for example we will have: `nimbl3-terra-app-staging` and `nimbl3-terra-app-production` (30 chars is limit for the naming!)

      ![][flavor_list]


- Init Terraform with the above workspace configuration:

```bash
  $ terraform init
```

- `Plan` to check for hardware preparation with the above provided Credentials:

```bash
  $ TF_VAR_heroku_token=$HEROKU_TOKEN TF_VAR_heroku_email=$HEROKU_EMAIL terraform plan
  # or
  # terraform plan -var heroku_token=$HEROKU_TOKEN -var heroku_email=$HEROKU_EMAIL
```

- `Apply` the Terraform configuration:

```bash
  $ printf 'yes' | TF_VAR_heroku_token=$HEROKU_TOKEN TF_VAR_heroku_email=$HEROKU_EMAIL terraform apply
  # or
  # printf 'yes' | terraform apply -var heroku_token=$HEROKU_TOKEN -var heroku_email=$HEROKU_EMAIL
```

- **Result**:
  - **Staging**:
  
    ![][staging]

  - **Production**:
    
    ![][production]

  - **On Heroku**:

    ![][app_flavors]
### TODO: list all the components/add-ons we are currently having in this setup

[flavor_list]: <screenshots/flavor_list.png>
[app_flavors]: <screenshots/app_flavors.png>
[staging]:<screenshots/staging_created.png>
[production]:<screenshots/production_created.png>