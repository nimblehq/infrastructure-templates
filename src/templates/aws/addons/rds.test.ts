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
        'main.tf',
        'providers.tf',
        'outputs.tf',
        'variables.tf',
        'modules/rds/main.tf',
        'modules/rds/variables.tf',
        'modules/rds/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds RDS module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('main.tf', rdsModuleContent);
    });

    it('adds RDS variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'variables.tf',
        rdsVariablesContent
      );
    });
  });
});
