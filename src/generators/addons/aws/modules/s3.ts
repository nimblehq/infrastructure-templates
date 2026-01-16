import { AwsOptions } from '@/generators/addons/aws';
import { isAwsModuleAdded } from '@/generators/addons/aws/dependencies';
import { copy } from '@/helpers/file';

import { AWS_TEMPLATE_PATH } from '../constants';

const applyAwsS3 = async (options: AwsOptions) => {
  if (isAwsModuleAdded('s3', options.projectName)) {
    return;
  }

  copy(`${AWS_TEMPLATE_PATH}/modules/s3`, 'modules/s3', options.projectName);
  copy(
    `${AWS_TEMPLATE_PATH}/modules/s3/bucket_policy`,
    'modules/s3/bucket_policy',
    options.projectName
  );
};

export default applyAwsS3;
