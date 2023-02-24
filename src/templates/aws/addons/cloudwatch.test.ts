import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import { applyCore } from '../../core';
import applyCloudwatch, { cloudwatchModuleContent } from './cloudwatch';
import applyCommon from './common';

describe('Cloudwatch add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'cloudwatch-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      applyCore(awsOptions);
      applyCommon(awsOptions);
      applyCloudwatch(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = [
        'base/main.tf',
        'base/providers.tf',
        'base/outputs.tf',
        'base/variables.tf',
        'modules/cloudwatch/main.tf',
        'modules/cloudwatch/variables.tf',
        'modules/cloudwatch/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds cloudwatch module to main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/main.tf',
        cloudwatchModuleContent
      );
    });
  });
});
