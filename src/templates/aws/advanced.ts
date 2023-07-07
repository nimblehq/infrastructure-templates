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

const applyAdvancedTemplate = (options: AwsOptions) => {
  applyEcr(options);
  applyCloudwatch(options);
  applyS3(options);
  applyAlb(options);
  applyRds(options);
  applyBastion(options);
  applySsm(options);
  applyEcs(options);
};

export { applyAdvancedTemplate };
