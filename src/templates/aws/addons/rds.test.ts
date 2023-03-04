import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import { applyCore } from '../../core';
import applyCommon from './common';
import applyRds, { rdsModuleContent, rdsVariablesContent } from './rds';

describe('RDS add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'rds-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      applyCore(awsOptions);
      applyCommon(awsOptions);
      applyRds(awsOptions);
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
        'modules/rds/main.tf',
        'modules/rds/variables.tf',
        'modules/rds/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds RDS module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('base/main.tf', rdsModuleContent);
    });

    it('adds RDS variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/variables.tf',
        rdsVariablesContent
      );
    });
  });
});
