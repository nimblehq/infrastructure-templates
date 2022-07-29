import { AwsOptions } from '.';
import {
  applyAlb,
  applyBastion,
  applyCommon,
  applyEcr,
  applyEcs,
  applyLog,
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
  applyLog(options);
  applyS3(options);
  applyAlb(options);
  applyRds(options);
  applyBastion(options);
  applySsm(options);
  applyEcs(options);
};

export { applyAdvancedTemplate };
