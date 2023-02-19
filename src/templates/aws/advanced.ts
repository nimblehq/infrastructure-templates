import { AwsOptions } from '.';
import {
  applyAlb,
  applyBastion,
  applyEcr,
  applyEcs,
  applyCloudwatch,
  applyRds,
  applyS3,
  applySsm,
} from './addons';

const applyAdvancedTemplate = async (options: AwsOptions) => {
  await applyEcr(options);
  await applyBastion(options);
  await applyRds(options);
  await applyEcs(options);
  await applyAlb(options);
  await applyCloudwatch(options);
  await applyS3(options);
  await applySsm(options);
};

export { applyAdvancedTemplate };
