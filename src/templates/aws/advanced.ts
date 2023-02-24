import { AwsOptions } from '.';
import {
  applyAlb,
  applyBastion,
  applyCommon,
  applyEcr,
  applyEcs,
  applyCloudwatch,
  applyRds,
  applyRegion,
  applyS3,
  applySecurityGroup,
  applySsm,
  applyVpc,
} from './addons';

const applyAdvancedTemplate = (options: AwsOptions) => {
  applyCommon(options);
  applyRegion(options);
  applyVpc(options);
  applySecurityGroup(options);
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
