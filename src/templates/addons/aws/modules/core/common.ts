import { copy } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import { INFRA_BASE_PATH, INFRA_SHARED_PATH } from '@/templates/core/constants';

import { AWS_SKELETON_PATH } from '../../constants';

const applyCommon = async (options: AwsOptions) => {
  copy(
    `${AWS_SKELETON_PATH}/providers.tf`,
    `${INFRA_BASE_PATH}/providers.tf`,
    options.projectName
  );
  copy(
    `${AWS_SKELETON_PATH}/providers.tf`,
    `${INFRA_SHARED_PATH}/providers.tf`,
    options.projectName
  );
};

export default applyCommon;
