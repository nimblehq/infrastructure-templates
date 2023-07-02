import { copy } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import { AWS_SKELETON_PATH } from '@/templates/addons/aws/constants';
import { INFRA_BASE_PATH, INFRA_SHARED_PATH } from '@/templates/core/constants';

const applyTerraformAWS = async (options: AwsOptions) => {
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

export default applyTerraformAWS;
