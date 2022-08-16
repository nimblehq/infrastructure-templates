import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import { applyTerraform } from '../../addons/terraform';
import applyCommon from './common';
import applyRegion, { regionVariablesContent } from './region';

describe('Region add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'region-addon-test';
    const awsRegion = 'ap-southeast-1';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion,
      };

      applyTerraform(awsOptions);
      applyCommon(awsOptions);
      applyRegion(awsOptions);
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
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds region variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'variables.tf',
        regionVariablesContent(awsRegion)
      );
    });
  });
});
