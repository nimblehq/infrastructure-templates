import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import { applyCore } from '../../core';
import applyCommon from './common';
import applyLog, { logModuleContent } from './log';

describe('Log add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'log-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      applyCore(awsOptions);
      applyCommon(awsOptions);
      applyLog(awsOptions);
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
        'modules/log/main.tf',
        'modules/log/variables.tf',
        'modules/log/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds log module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('base/main.tf', logModuleContent);
    });
  });
});
