# Nimble Infrastructure Template

An infrastructure template for web applications powered by Terraform.

**Supported cloud:** AWS. We are looking for contributions to implement support for GCP, Heroku, and Azure!

**Supported flavors:**
- A `Basic` flavor is in the plan, but not available yet
- The `Complete` flavor generates the following infrastructure:

![Diagram of the Complete Infrastructure](https://github.com/nimblehq/infrastructure-templates/blob/develop/img/diagram_complete.svg?raw=true)

## Usage

```bash
npm install -g @nimblehq/infra-template

nimble-infra generate {project-name}
```

or

```bash
npx @nimblehq/infra-template generate {project-name}
```

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
