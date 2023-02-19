import { AwsOptions } from '../..';
import { copy } from '../../../../helpers/file';
import { INFRA_BASE_PATH, INFRA_SHARED_PATH } from '../../../core/constants';

const applyCommon = async (options: AwsOptions) => {
  copy(
    'aws/providers.tf',
    `${INFRA_BASE_PATH}/providers.tf`,
    options.projectName
  );
  copy(
    'aws/providers.tf',
    `${INFRA_SHARED_PATH}/providers.tf`,
    options.projectName
  );
};

export default applyCommon;
