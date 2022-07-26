import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import applyCommon from './common';
import applySsm, { ssmModuleContent, ssmVariablesContent } from './ssm';

describe('SSM add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'ssm-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = { projectName: projectDir, provider: 'aws', infrastructureType: 'advanced', awsRegion: 'ap-southeast-1' };

      applyCommon(awsOptions);
      applySsm(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = ['main.tf', 'providers.tf', 'outputs.tf', 'variables.tf', 'modules/ssm/main.tf', 'modules/ssm/variables.tf', 'modules/ssm/outputs.tf'];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('creates expected folders', () => {
      expect(projectDir).toHaveDirectory('modules/ssm/');
    });

    it('adds SSM module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('main.tf', ssmModuleContent);
    });

    it('adds SSM variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile('variables.tf', ssmVariablesContent);
    });
  });
});
