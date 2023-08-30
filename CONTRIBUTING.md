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

The CLI supports the following commands:

1. `generate` - to generate a new Terraform project

```bash
bin/dev generate {project-name}
```

2. `install` - to install a new addon/module to an existing Terraform project

```bash
bin/dev install {addon-name} --project {project-name}
```

### Project structure

The project has the following main files and folders:

```bash
├── bin # the executable file for the CLI
│   ├── dev # the executable file for the CLI in development mode
│   └── run # the executable file for the CLI in production mode
├── templates # the templates files for the project
│   ├── addons # the templates files for common addons e.g. version control, CI/CD, etc.
│   │   ├── aws # the templates files for AWS modules
│   │   └── versionControl # the templates files for version control
│   └── core # the templates folders
│       ├── base # the templates files for the base folder
│       └── shared # the templates files for the shared folder
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

> [!NOTE]\
> The `templates` folder and the `templates` folder are the two main folders that are used to generate the project files

- The `templates` folder contains the addon's files and folders ready to be directly copy-pasted into the generated project if the related addon has been selected. These files serve as a starting point or "templates" for the specific addon.

- On the other hand, the `templates` folder houses the logic for determining which files need to be copied from the templates folder into the core project files. It includes instructions on what files should be formed based on the type of addon/module being added (common addons, AWS modules, or standard files).

In summary, while the `templates` folder provides the files and folders needed for the addon, the `templates` folder handles the dynamic copying and integration of those files within the core project structure.

### Add a new command

To add a new command, create a new folder in the `src/commands` and add the `index.ts` file.
The command documentation can be found [here](https://oclif.io/docs/commands).

### Add a new addon/module

#### Adding a New Addon/Module

To add a new addon or module, follow these steps:

1. Navigate to the `src/templates` folder in the project directory.
2. Create a new folder depending on the type of the addon/module you want to add:
   - For addons, create a new folder in the `src/templates/addons` directory.
   - For the core Terraform files, create a new folder/file in the `src/templates/core` directory.

Inside the newly created addon/module folder, you can include the code required to generate the templates.

3. Navigate to the `templates` folder at the same level as the `src` folder in the project directory.
4. Add the templates folders/files for the addon/module that you are adding inside the corresponding folder in the `templates` directory.

> [!NOTE]\
> Before adding a new addon/module, it is recommended to check the existing ones for reference.

#### Using the Template as a Reference

To copy and include supporting modules from the template, you can follow these steps:

1. Open the `src/templates` directory in your project.
2. Explore the code and structure of the existing addon or module that you want to reference.

Inside each addon or module folder, you will find the necessary files and directories needed for that specific functionality.

3. Once you have identified the supporting modules or files you want to include in your own project, mirror the folder structure and file naming conventions of the existing addon or module that you are referencing.

4. Copy and paste the relevant files from the existing addon or module into your new addon/module folder.

> [!NOTE]\
> Make sure to update any necessary configuration or code inside the copied files to fit your specific requirements.

By following this process, you can use the existing templates as a reference to create your own addons or modules based on the provided structure and functionality.

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

- The release should be created in the `main` branch and created with the following format: `{major}.{minor}.{patch}`, e.g. `1.0.0`.

### Manual publishing

- To publish the project manually, run the following command:

```bash
npm run publish
```

> [!IMPORTANT]\
> NPM credentials are required to publish the project. Ensure that the version in `package.json` is updated.
