# Contributing guidelines for the project

First off, thank you for considering contributing to this project. It's people like you that make this project such a great tool. We appreciate your help!

The following is a set of guidelines for contributing to this project. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Introduction

This project is using TypeScript and [OCLIF](https://oclif.io/) to build the CLI. The project is using Jest for testing, ESLint for code formatting and linting.

## Issues and feature requests

If you have any issues or feature requests, please create an issue in the [GitHub issues](https://github.com/nimblehq/infrastructure-templates/issues) page.

## Development

### Prerequisites

- Node.js 12.0.0 or higher
- NPM is preferred to use with this project, but you can use Yarn as well and don't commit the `yarn.lock` file to the repository

### Install dependencies

```bash
npm install
```

### Run the CLI locally

Run the following command and follow the instructions:

```bash
bin/dev generate {project-name}
```

### Project structure

The project has the following main folders:

- `bin` - contains the executable file for the CLI
  - `dev` - the executable file for the CLI in development mode
  - `run` - the executable file for the CLI in production mode

- `src` - contains the source code of the CLI
  - `index.ts` - the entry point of the CLI
  - `commands` - contains the commands of the CLI
  - `helpers` - contains the helper functions of the CLI
    - `childProcess` - contains the helper functions for child process
    - `file` - contains the helper functions for file interaction
    - `terraform` - contains the helper functions for Terraform
  - `templates` - contains the code to generate the templates
    - `addons` - contains the code to generate the common addons e.g. version control, CI/CD, etc.
    - `aws` - contains the code to generate the AWS modules e.g. VPC, RDS, etc.
    - `core` - contains the code to generate the main Terraform files e.g. `main.tf`, `variables.tf`, etc.
  - `skeleton` - contains the skeleton files for the project
    - `addons` - contains the skeleton files for common addons e.g. version control, CI/CD, etc.
    - `aws` - contains the skeleton files for AWS modules
    - `core` - contains the skeleton files for common files e.g. `main.tf`, `variables.tf`, `.gitignore`, etc.
  - `test` - contains the test helpers and configurations

### Add a new command

To add a new command, you need to create a new folder in the `src/commands` folder and add the `index.ts` file in it.
The command documentation can be found [here](https://oclif.io/docs/commands).

### Add a new addon/module

To add a new addon/module, you need to create a new folder in the `src/templates` folder depending on the type of the addon/module:

- For common addons, create a new folder in the `src/templates/addons` folder
- For AWS modules, create a new folder in the `src/templates/aws` folder
- For common files, create a new folder in the `src/templates/core` folder

Check the existing addons/modules for the reference.

## Testing

### Run tests

```bash
npm run test
```

### Run and fix linting

```bash
npm run lint // to check linting

npm run lint:fix // to fix linting
```

## Publishing

- This project will be published to NPM automatically when a new release is created in GitHub. Therefore, the package version in `package.json` should be updated before creating a new release.

- The release should be created in the `master` branch.

- The release should be created with the following format: `{version}` e.g. `1.0.0`

### Manual publishing

- To publish the project manually, run the following command:

```bash
npm run publish
```

**Note:** You need to have the NPM account to publish the project and make sure that the version in `package.json` is updated.
