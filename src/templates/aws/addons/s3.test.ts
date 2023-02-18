import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import { applyCore } from '../../core';
import applyCommon from './common';
import applyS3, { s3ModuleContent, s3OutputsContent } from './s3';

describe('S3 add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 's3-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      applyCore(awsOptions);
      applyCommon(awsOptions);
      applyS3(awsOptions);
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
        'modules/s3/main.tf',
        'modules/s3/variables.tf',
        'modules/s3/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds S3 module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('base/main.tf', s3ModuleContent);
    });

    it('adds S3 outputs to outputs.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/outputs.tf',
        s3OutputsContent
      );
    });
  });
});
