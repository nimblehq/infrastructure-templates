import { runCommand } from './child-process';

const detectTerraform = async() => {
  const terraformPath = await runCommand('which', ['terraform']);
  if (terraformPath) {
    return true;
  }

  console.log('Terraform not found. Please install terraform.');
  return false;
};

const formatCode = (projectDir: string) => {
  runCommand('terraform', ['fmt'], projectDir);
};

export {
  detectTerraform,
  formatCode,
};
