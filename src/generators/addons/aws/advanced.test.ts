import { remove } from '@/helpers/file';

import { AwsAddonModules, AwsOptions } from '.';
import { applyAdvancedTemplate } from './advanced';
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

jest.mock('./modules');

describe('AWS advanced template', () => {
  describe('applyAdvancedTemplate', () => {
    const projectDir = 'aws-advanced-test';
    const options: AwsOptions = {
      projectName: projectDir,
      provider: 'aws',
      infrastructureType: 'advanced',
      awsRegion: 'ap-southeast-1',
      addonModules: [],
      enabledSecurityFeatures: false,
    };

    beforeAll(async () => {
      await applyAdvancedTemplate(options);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('applies ECR add-on', () => {
      expect(applyAwsEcr).toHaveBeenCalledWith(options);
    });

    it('applies cloudwatch add-on', () => {
      expect(applyAwsCloudwatch).toHaveBeenCalledWith(options);
    });

    it('applies S3 add-on', () => {
      expect(applyAwsS3).toHaveBeenCalledWith(options);
    });

    it('applies ALB add-on', () => {
      expect(applyAwsAlb).toHaveBeenCalledWith(options);
    });

    it('applies RDS add-on', () => {
      expect(applyAwsRds).toHaveBeenCalledWith(options);
    });

    it('applies bastion add-on', () => {
      expect(applyAwsBastion).toHaveBeenCalledWith(options);
    });

    it('applies SSM add-on', () => {
      expect(applyAwsSsm).toHaveBeenCalledWith(options);
    });

    it('applies ECS add-on', () => {
      expect(applyAwsEcs).toHaveBeenCalledWith(options);
    });

    describe('given enabledSecurityFeatures is not set', () => {
      it('does NOT apply VPC Flow Log add-on', () => {
        expect(applyAwsVpcFlowLog).not.toHaveBeenCalled();
      });

      it('does NOT apply CloudTrail add-on', () => {
        expect(applyAwsCloudtrail).not.toHaveBeenCalled();
      });
    });

    describe('given enabledSecurityFeatures is true', () => {
      describe('given addonModules includes vpcFlowLog', () => {
        const optionsEnabledSecurityFeatures: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
          awsRegion: 'ap-southeast-1',
          enabledSecurityFeatures: true,
          addonModules: [AwsAddonModules.VPC_FLOW_LOG],
        };

        beforeAll(async () => {
          jest.clearAllMocks();
          await applyAdvancedTemplate(optionsEnabledSecurityFeatures);
        });

        afterAll(() => {
          jest.clearAllMocks();
          remove('/', projectDir);
        });

        it('applies VPC Flow Log add-on when flag is set', () => {
          expect(applyAwsVpcFlowLog).toHaveBeenCalledWith(
            optionsEnabledSecurityFeatures
          );
        });
      });

      describe('given addonModules does NOT include vpcFlowLog', () => {
        const optionsEnabledSecurityFeaturesWithoutVpcFlowLog: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
          awsRegion: 'ap-southeast-1',
          enabledSecurityFeatures: true,
          addonModules: [], // No vpcFlowLog
        };

        afterAll(() => {
          jest.clearAllMocks();
          remove('/', projectDir);
        });

        it('does NOT apply VPC Flow Log add-on when flag is set but module is not included', async () => {
          await applyAdvancedTemplate(
            optionsEnabledSecurityFeaturesWithoutVpcFlowLog
          );
          expect(applyAwsVpcFlowLog).not.toHaveBeenCalled();
        });
      });

      describe('given addonModules includes cloudtrail', () => {
        const optionsEnabledSecurityFeaturesWithCloudTrail: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
          awsRegion: 'ap-southeast-1',
          enabledSecurityFeatures: true,
          addonModules: [AwsAddonModules.CLOUDTRAIL],
        };

        beforeAll(async () => {
          jest.clearAllMocks();
          await applyAdvancedTemplate(
            optionsEnabledSecurityFeaturesWithCloudTrail
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
          remove('/', projectDir);
        });

        it('applies CloudTrail add-on when flag is set', () => {
          expect(applyAwsCloudtrail).toHaveBeenCalledWith(
            optionsEnabledSecurityFeaturesWithCloudTrail
          );
        });
      });

      describe('given addonModules does NOT include cloudtrail', () => {
        const optionsEnabledSecurityFeaturesWithoutCloudTrail: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
          awsRegion: 'ap-southeast-1',
          enabledSecurityFeatures: true,
          addonModules: [], // No cloudtrail
        };

        afterAll(() => {
          jest.clearAllMocks();
          remove('/', projectDir);
        });

        it('does NOT apply CloudTrail add-on when flag is set but module is not included', async () => {
          await applyAdvancedTemplate(
            optionsEnabledSecurityFeaturesWithoutCloudTrail
          );
          expect(applyAwsCloudtrail).not.toHaveBeenCalled();
        });
      });
    });
  });
});
