import { AwsOptions } from '@/generators/addons/aws';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import applyTerraformAwsProvider from './core/provider';
import applyAwsSsm, { ssmModuleContent, ssmVariablesContent } from './ssm';

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn().mockResolvedValue({ apply: true }),
  };
});

describe('SSM add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'ssm-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      await applyTerraformCore(awsOptions);
      await applyTerraformAwsProvider(awsOptions);
      await applyAwsSsm(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = [
        'core/main.tf',
        'core/providers.tf',
        'core/outputs.tf',
        'core/variables.tf',
        'modules/ssm/main.tf',
        'modules/ssm/variables.tf',
        'modules/ssm/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds SSM module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('core/main.tf', ssmModuleContent);
    });

    it('adds SSM variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/variables.tf',
        ssmVariablesContent
      );
    });
  });
});
