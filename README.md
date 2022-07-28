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

> TODO: Describe the steps needed to move from a fresh new project, to a deployed infrastructure.

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
