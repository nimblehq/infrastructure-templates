import { remove } from '@/helpers/file';

import { AwsOptions } from '.';
import { applyAdvancedTemplate } from './advanced';
import {
  applyAwsAlb,
  applyAwsBastion,
  applyAwsEcr,
  applyAwsEcs,
  applyAwsCloudwatch,
  applyAwsRds,
  applyAwsS3,
  applyAwsSsm,
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
  });
});
