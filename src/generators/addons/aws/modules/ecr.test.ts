import { AwsOptions } from '@/generators/addons/aws';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import applyTerraformAwsProvider from './core/provider';
import applyAwsEcr, { ecrModuleContent, ecrVariablesContent } from './ecr';

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn().mockResolvedValue({ apply: true }),
  };
});

describe('ECR add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'ecr-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      await applyTerraformCore(awsOptions);
      await applyTerraformAwsProvider(awsOptions);
      await applyAwsEcr(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = [
        'shared/main.tf',
        'shared/providers.tf',
        'shared/outputs.tf',
        'shared/variables.tf',
        'modules/ecr/main.tf',
        'modules/ecr/variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds ECR module to main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'shared/main.tf',
        ecrModuleContent
      );
    });

    it('adds ECR variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'shared/variables.tf',
        ecrVariablesContent
      );
    });
  });
});
