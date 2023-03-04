import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import { applyCore } from '../../core';
import applyCommon from './common';
import applySsm, { ssmModuleContent, ssmVariablesContent } from './ssm';

describe('SSM add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'ssm-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      applyCore(awsOptions);
      applyCommon(awsOptions);
      applySsm(awsOptions);
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
        'modules/ssm/main.tf',
        'modules/ssm/variables.tf',
        'modules/ssm/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds SSM module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('base/main.tf', ssmModuleContent);
    });

    it('adds SSM variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/variables.tf',
        ssmVariablesContent
      );
    });
  });
});
