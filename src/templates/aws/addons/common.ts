import { AwsOptions } from '..';
import { copy } from '../../../helpers/file';

const applyCommon = ({ projectName }: AwsOptions) => {
  const filesToCopy = [
    'main.tf',
    'outputs.tf',
    'providers.tf',
    'variables.tf',
  ];

  filesToCopy.forEach(fileName => {
    copy(`aws/${fileName}`, fileName, projectName);
  });
};

export default applyCommon;
