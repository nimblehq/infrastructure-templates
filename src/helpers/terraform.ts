import { runCommand } from './childProcess';

const detectTerraform = async () => {
  try {
    await runCommand('which', ['terraform']);

    return true;
  } catch (error) {
    console.error('Terraform not found. Please install terraform.');

    return false;
  }
};

const formatCode = async (projectDir: string) => {
  try {
    await runCommand('terraform', ['fmt', '-recursive'], projectDir);
  } catch (error) {
    console.error(error);
  }
};

export { detectTerraform, formatCode };
