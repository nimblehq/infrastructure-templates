import { GeneralOptions } from '@/commands/generate';
import { getProjectPath } from '@/helpers/file';
import { detectTerraform, formatCode } from '@/helpers/terraform';

const postProcess = async (generalOptions: GeneralOptions) => {
  try {
    if (await detectTerraform()) {
      await formatCode(getProjectPath(generalOptions.projectName));
      console.log('formatCode');
    }
  } catch (error) {
    console.error(error);
  }
};

export { postProcess };
