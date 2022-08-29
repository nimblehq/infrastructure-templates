import { AwsOptions } from '..';
import { copy } from '../../../helpers/file';

const applyCommon = ({ projectName }: AwsOptions) => {
  copy('aws/providers.tf', 'providers.tf', projectName);
};

export default applyCommon;
