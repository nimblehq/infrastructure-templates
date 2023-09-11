import { runCommand } from './childProcess';

const detectTerraform = async () => {
  try {
    await runCommand('terraform', []);

    return true;
  } catch (error) {
    console.log('Terraform not found. Please install terraform.');

    return false;
  }
};

const formatCode = async (projectDir: string) => {
  try {
    await runCommand('terraform', ['fmt', '-recursive'], projectDir);
  } catch (error) {
    console.log("Couldn't format terraform code.");
  }
};

export { detectTerraform, formatCode };
