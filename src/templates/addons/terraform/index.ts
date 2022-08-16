import { GeneralOptions } from '../../../commands/generate';
import { copy } from '../../../helpers/file';

const applyTerraform = (generalOptions: GeneralOptions): void => {
  const { projectName } = generalOptions;

  copy('terraform/', '.', projectName);
};

export { applyTerraform };
