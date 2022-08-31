import { GeneralOptions } from '../../commands/generate';
import { copy } from '../../helpers/file';

const applyCore = (generalOptions: GeneralOptions): void => {
  const { projectName } = generalOptions;

  copy('core/', '.', projectName);
};

export { applyCore };
