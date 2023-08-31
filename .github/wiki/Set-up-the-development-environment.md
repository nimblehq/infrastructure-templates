## Dependencies and Prerequisites

- [Node.js](https://nodejs.org/en/download/) 12.x or higher - 18.x LTS is recommended
- NPM is preferred to use with this project

## Install dependencies

```bash
npm install
```

## Run the CLI locally

The CLI supports the following commands:

1. `generate` - to generate a new Terraform project

```bash
bin/dev generate {project-name}
```

2. `install` - to install a new addon/module to an existing Terraform project

```bash
bin/dev install {addon-name} --project {project-name}
```
