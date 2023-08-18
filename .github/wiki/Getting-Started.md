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

### Reference as a template

> **Note**!\
> This template can be used for reference to add an addon/module to an existing Terraform project
