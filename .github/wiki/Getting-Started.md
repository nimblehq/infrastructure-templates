## Usage

The CLI can be installed globally or run directly with `npx`:

```bash
npm install -g @nimblehq/infra-template
nimble-infra generate {project-name}

# or

npx @nimblehq/infra-template generate {project-name}
```

The CLI supports the following commands:
- `generate` - to generate a new Terraform project:

```bash
nimble-infra generate {project-name}
```

- `install` - to install a new addon/module to an existing Terraform project:

```bash
nimble-infra install {addon-name} --project {project-name}
```

> **Note**!\
> Terraform Cloud is supported by default. You need to set the `organization` and `workspace` in the `terraform` block of the `main.tf` file to use it.
> If you don't want to use Terraform Cloud, you can remove the `cloud` block in the `main.tf` file.

### Reference as a template

> **Note**!\
> This template can be used for reference to add an addon/module to an existing Terraform project
