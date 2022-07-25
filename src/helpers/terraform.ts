import { runCommand } from './child-process';

const detectTerraform = async() => {
  try {
    await runCommand('which', ['terraform']);

    return true;
  } catch (error) {
    console.error('Terraform not found. Please install terraform.');

    return false;
  }
};

const formatCode = (projectDir: string) => {
  try {
    runCommand('terraform', [' fmt'], projectDir);
  } catch (error) {
    console.error(error);
  }
};

export {
  detectTerraform,
  formatCode,
};
