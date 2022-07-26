import { AwsOptions } from '.';
import { remove } from '../../helpers/file';
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
import { applyAdvancedTemplate } from './advanced';

jest.mock('./addons');

describe('AWS advanced template', () => {
  describe('applyAdvancedTemplate', () => {
    const projectDir = 'aws-advanced-test';
    const options: AwsOptions = { projectName: projectDir, provider: 'aws', infrastructureType: 'advanced', awsRegion: 'ap-southeast-1' };

    beforeAll(() => {
      applyAdvancedTemplate(options);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('applies common add-on', () => {
      expect(applyCommon).toHaveBeenCalledWith(options);
    });

    it('applies region add-on', () => {
      expect(applyRegion).toHaveBeenCalledWith(options);
    });

    it('applies VPC add-on', () => {
      expect(applyVpc).toHaveBeenCalledWith(options);
    });

    it('applies security group add-on', () => {
      expect(applySecurityGroup).toHaveBeenCalledWith(options);
    });

    it('applies ECR add-on', () => {
      expect(applyEcr).toHaveBeenCalledWith(options);
    });

    it('applies log add-on', () => {
      expect(applyLog).toHaveBeenCalledWith(options);
    });

    it('applies S3 add-on', () => {
      expect(applyS3).toHaveBeenCalledWith(options);
    });

    it('applies ALB add-on', () => {
      expect(applyAlb).toHaveBeenCalledWith(options);
    });

    it('applies RDS add-on', () => {
      expect(applyRds).toHaveBeenCalledWith(options);
    });

    it('applies bastion add-on', () => {
      expect(applyBastion).toHaveBeenCalledWith(options);
    });

    it('applies SSM add-on', () => {
      expect(applySsm).toHaveBeenCalledWith(options);
    });

    it('applies ECS add-on', () => {
      expect(applyEcs).toHaveBeenCalledWith(options);
    });
  });
});
