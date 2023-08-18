# Nimble Infrastructure Template

An infrastructure template for web applications powered by Terraform.

**Supported cloud:** AWS. We are looking for contributions to implement support for GCP, Heroku, and Azure!

**Supported flavors:**
- A `Blank` flavor that generates a blank Terraform project.
- The `Complete` flavor generates the following infrastructure:

![Diagram of the Complete Infrastructure](/img/diagram_complete.svg?raw=true)

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

> [!NOTE]\
> Terraform Cloud is supported by default. You need to set the `organization` and `workspace` in the `terraform` block of the `main.tf` file to use it.
> If you don't want to use Terraform Cloud, you can remove the `cloud` block in the `main.tf` file.

### Reference as a template

> [!NOTE]\
> This template can be used for reference to add an addon/module to an existing Terraform project



## Contributing

Check out our [contributing guidelines](/CONTRIBUTING.md) to get started.

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
