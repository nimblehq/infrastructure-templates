import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import { applyTerraform } from '../../addons/terraform';
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

      applyTerraform(awsOptions);
      applyCommon(awsOptions);
      applyLog(awsOptions);
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
        'modules/log/main.tf',
        'modules/log/variables.tf',
        'modules/log/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds log module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('main.tf', logModuleContent);
    });
  });
});
