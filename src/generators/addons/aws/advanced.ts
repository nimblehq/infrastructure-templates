import { AwsAddonModules, AwsOptions } from '.';
import {
  applyAwsAlb,
  applyAwsBastion,
  applyAwsCloudtrail,
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

  if (options?.addonModules && options?.addonModules.length > 0) {
    await Promise.all(
      options.addonModules.map((module) => {
        switch (module) {
          case AwsAddonModules.VPC_FLOW_LOG:
            return applyAwsVpcFlowLog(options);
          case AwsAddonModules.CLOUDTRAIL:
            return applyAwsCloudtrail(options);
          default:
            throw new Error(`Module ${module} has not been implemented!`);
        }
      })
    );
  }
};

export { applyAdvancedTemplate };
