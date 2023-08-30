This project uses TypeScript and [OCLIF](https://oclif.io/) to build the CLI, Jest for testing, and ESLint for code formatting and linting.

## Project structure

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

> [!NOTE]\
> The `skeleton` folder and the `templates` folder are the two main folders that are used to generate the project files

- The `skeleton` folder contains the addon's files and folders ready to be directly copy-pasted into the generated project if the related addon has been selected. These files serve as a starting point or "skeleton" for the specific addon.

- On the other hand, the `templates` folder houses the logic for determining which files need to be copied from the templates folder into the core project files. It includes instructions on what files should be formed based on the type of addon/module being added (common addons, AWS modules, or standard files).

In summary, while the `skeleton` folder provides the files and folders needed for the addon, the `templates` folder handles the dynamic copying and integration of those files within the core project structure.