import { AwsOptions } from '..';
import { copyFile } from '../../../helpers/file';

const applyCommon = ({ projectName }: AwsOptions) => {
  const filesToCopy = [
    'main.tf',
    'outputs.tf',
    'providers.tf',
    'variables.tf',
  ];

  filesToCopy.forEach(fileName => {
    copyFile(`aws/${fileName}`, fileName, projectName);
  });
};

export default applyCommon;
