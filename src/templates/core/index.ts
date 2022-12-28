import { GeneralOptions } from '../../commands/generate';
import { copy, rename } from '../../helpers/file';

const applyCore = (generalOptions: GeneralOptions): void => {
  const { projectName } = generalOptions;

  copy('core/', '.', projectName);

  // Need to rename .gitignore to gitignore because NPN package doesn't include .gitignore
  // https://github.com/npm/npm/issues/3763
  rename('gitignore', '.gitignore', projectName);
};

export { applyCore };
