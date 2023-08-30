import { AwsOptions } from '@/generators/addons/aws';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import applyAwsCloudwatch, {
  cloudwatchModuleContent,
  cloudwatchVariablesContent,
} from './cloudwatch';
import applyTerraformAwsProvider from './core/provider';

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn().mockResolvedValue({ apply: true }),
  };
});

describe('Cloudwatch add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'cloudwatch-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      await applyTerraformCore(awsOptions);
      await applyTerraformAwsProvider(awsOptions);
      await applyAwsCloudwatch(awsOptions);
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
        'modules/cloudwatch/main.tf',
        'modules/cloudwatch/variables.tf',
        'modules/cloudwatch/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds cloudwatch module to main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/main.tf',
        cloudwatchModuleContent
      );
    });

    it('adds cloudwatch variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/variables.tf',
        cloudwatchVariablesContent
      );
    });
  });
});
