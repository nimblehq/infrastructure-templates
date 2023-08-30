To add a new addon or module, follow these steps:

1. Navigate to the `src/templates` folder in the project directory.
2. Create a new folder depending on the type of the addon/module you want to add:
   - For addons, create a new folder in the `src/templates/addons` directory.
   - For the core Terraform files, create a new folder/file in the `src/templates/core` directory.

  Inside the newly created addon/module folder, you can include the code required to generate the templates.

3. Navigate to the `skeleton` folder at the same level as the `src` folder in the project directory.
4. Add the skeleton folders/files for the addon/module that you are adding inside the corresponding folder in the `skeleton` directory.

> [!NOTE]\
> Before adding a new addon/module, it is recommended to check the existing ones for reference.