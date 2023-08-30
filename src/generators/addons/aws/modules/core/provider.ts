import { AwsOptions } from '@/generators/addons/aws';
import { AWS_SKELETON_PATH } from '@/generators/addons/aws/constants';
import {
  INFRA_BASE_PATH,
  INFRA_SHARED_PATH,
} from '@/generators/core/constants';
import { copy } from '@/helpers/file';

const applyTerraformAwsProvider = async (options: AwsOptions) => {
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

export default applyTerraformAwsProvider;
