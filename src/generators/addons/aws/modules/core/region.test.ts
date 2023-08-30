import { AwsOptions } from '@/generators/addons/aws';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import applyTerraformAwsProvider from './provider';
import applyAwsRegion, { regionVariablesContent } from './region';

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn().mockResolvedValue({ apply: true }),
  };
});

describe('Region add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'region-addon-test';
    const awsRegion = 'ap-southeast-1';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion,
      };

      await applyTerraformCore(awsOptions);
      await applyTerraformAwsProvider(awsOptions);
      await applyAwsRegion(awsOptions);
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
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds region variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/variables.tf',
        regionVariablesContent(awsRegion)
      );
      expect(projectDir).toHaveContentInFile(
        'shared/variables.tf',
        regionVariablesContent(awsRegion)
      );
    });
  });
});
