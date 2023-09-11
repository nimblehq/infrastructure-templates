import { GeneralOptions } from '@/commands/generate';
import { getProjectPath } from '@/helpers/file';
import { detectTerraform, formatCode } from '@/helpers/terraform';

const postProcess = async (generalOptions: GeneralOptions) => {
  try {
    if (await detectTerraform()) {
      await formatCode(getProjectPath(generalOptions.projectName));
    }
  } catch (error) {
    console.log(error);
  }
};

export { postProcess };
