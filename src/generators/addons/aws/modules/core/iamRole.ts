import { AwsOptions } from '@/generators/addons/aws';
import { AWS_TEMPLATE_PATH } from '@/generators/addons/aws/constants';
import { isAwsModuleAdded } from '@/generators/addons/aws/dependencies';
import { copy } from '@/helpers/file';

const applyAwsIamRole = async (options: AwsOptions) => {
  if (isAwsModuleAdded('iamRole', options.projectName)) {
    return;
  }

  copy(
    `${AWS_TEMPLATE_PATH}/modules/iam_role`,
    'modules/iam_role',
    options.projectName
  );
};

export default applyAwsIamRole;
