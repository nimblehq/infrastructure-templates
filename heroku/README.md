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
  $ export HEROKU_EMAIL=`heroku auth:whoami`
  # This token will last for 5 mins (300sec) only
  $ export HEROKU_TOKEN=`heroku authorizations:create -S -e 300`
  
```

- Init Terraform with the above granted token:

```bash
  $ TF_VAR_heroku_token=$HEROKU_TOKEN TF_VAR_heroku_email=$HEROKU_EMAIL terraform init
  # or
  # terraform init -var heroku_token=$HEROKU_TOKEN -var heroku_email=$HEROKU_EMAIL
```

- `Plan` to check for hardware preparation:

```bash
  $ TF_VAR_heroku_token=$HEROKU_TOKEN TF_VAR_heroku_email=$HEROKU_EMAIL terraform plan
  # or
  # terraform plan -var heroku_token=$HEROKU_TOKEN -var heroku_email=$HEROKU_EMAIL
```

- `Apply` the Terraform configuration:

```bash
  $ TF_VAR_heroku_token=$HEROKU_TOKEN TF_VAR_heroku_email=$HEROKU_EMAIL terraform apply
  # or
  # terraform apply -var heroku_token=$HEROKU_TOKEN -var heroku_email=$HEROKU_EMAIL
```

### TODO: list all the components/add-ons we are currently having in this setup