# Contributing guidelines for the project

First off, thank you for considering contributing to this project. It's people like you that make this project such a great tool. We appreciate your help!

The following is a set of guidelines for contributing to this project. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Introduction

This project uses TypeScript and [OCLIF](https://oclif.io/) to build the CLI, Jest for testing, and ESLint for code formatting and linting.

## Issues and feature requests

If you have any issues or feature requests, please create an issue in the [GitHub issues](https://github.com/nimblehq/infrastructure-templates/issues) page.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) 12.x or higher - 18.x LTS is recommended
- NPM is preferred to use with this project

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

The project has the following main files and folders:

```bash
├── bin # the executable file for the CLI
│   ├── dev # the executable file for the CLI in development mode
│   └── run # the executable file for the CLI in production mode
├── skeleton # the skeleton files for the project
│   ├── addons # the skeleton files for common addons e.g. version control, CI/CD, etc.
│   │   ├── aws # the skeleton files for AWS modules
│   │   └── versionControl # the skeleton files for version control
│   └── core # the skeleton folders
│       ├── base # the skeleton files for the base folder
│       └── shared # the skeleton files for the shared folder
├── src # the source code of the CLI
│   ├── commands # the commands of the CLI
│   │   ├── generate
│   │   └── installAddon
│   ├── helpers # the helper functions of the CLI
│   │   ├── childProcess.ts
│   │   ├── file.ts
│   │   └── terraform.ts
│   ├── hooks # the hooks of the CLI
│   │   └── postProcess.ts
│   ├── index.ts # the entry point of the CLI
│   └── templates # the code to generate the templates
│       ├── addons # the code to generate the common addons e.g. version control, CI/CD, AWS, etc.
│       └── core # the code to generate the main Terraform files e.g. `main.tf`, `variables.tf`, etc.
└── test # the test helpers and configurations
    └── matchers # the custom matchers for Jest
        ├── file.ts
        ├── index.d.ts
        └── index.ts
```

### Add a new command

To add a new command, create a new folder in the `src/commands` and add the `index.ts` file.
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

- The release should be created in the `main` branch.

- The release should be created with the following format: `{version}` e.g. `1.0.0`

### Manual publishing

- To publish the project manually, run the following command:

```bash
npm run publish
```

**Note:** NPM credentials are required to publish the project. Ensure that the version in `package.json` is updated.
