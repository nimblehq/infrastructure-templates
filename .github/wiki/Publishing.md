- This project will be published to NPM automatically when a new release is created in GitHub. Therefore, the package version in `package.json` should be updated before creating a new release.

- The release should be created in the `main` branch and created with the following format: `{major}.{minor}.{patch}`, e.g. `1.0.0`.

## Manual publishing

- To publish the project manually, run the following command:

```bash
npm run publish
```

> [!IMPORTANT]\
> NPM credentials are required to publish the project. Ensure that the version in `package.json` is updated.
