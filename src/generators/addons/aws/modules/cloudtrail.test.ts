import { AwsOptions } from '@/generators/addons/aws';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import applyAwsCloudtrail, {
  cloudtrailModuleContent,
  cloudtrailOutputsContent,
  cloudtrailVariablesContent,
} from './cloudtrail';
import applyTerraformAwsProvider from './core/provider';

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn().mockResolvedValue({ apply: true }),
  };
});

describe('CloudTrail add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'cloudtrail-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      await applyTerraformCore(awsOptions);
      await applyTerraformAwsProvider(awsOptions);
      await applyAwsCloudtrail(awsOptions);
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
        'modules/cloudtrail/main.tf',
        'modules/cloudtrail/variables.tf',
        'modules/cloudtrail/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds cloudtrail module to main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/main.tf',
        cloudtrailModuleContent
      );
    });

    it('adds cloudtrail variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/variables.tf',
        cloudtrailVariablesContent
      );
    });

    it('adds cloudtrail outputs to outputs.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/outputs.tf',
        cloudtrailOutputsContent
      );
    });
  });
});
