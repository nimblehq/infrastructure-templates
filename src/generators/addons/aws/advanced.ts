import { AwsOptions } from '.';
import {
  applyAwsAlb,
  applyAwsBastion,
  applyAwsEcr,
  applyAwsEcs,
  applyAwsCloudwatch,
  applyAwsRds,
  applyAwsS3,
  applyAwsSsm,
  applyAwsVpcFlowLog,
} from './modules';

const applyAdvancedTemplate = async (options: AwsOptions) => {
  await applyAwsEcr(options);
  await applyAwsBastion(options);
  await applyAwsRds(options);
  await applyAwsEcs(options);
  await applyAwsAlb(options);
  await applyAwsCloudwatch(options);
  await applyAwsS3(options);
  await applyAwsSsm(options);

  if (options.enabledSecurityFeatures) {
    await applyAwsVpcFlowLog(options);
  }
};

export { applyAdvancedTemplate };
