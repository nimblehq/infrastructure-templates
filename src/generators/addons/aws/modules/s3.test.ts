import { AwsOptions } from '@/generators/addons/aws';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import applyTerraformAwsProvider from './core/provider';
import applyAwsS3 from './s3';

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn().mockResolvedValue({ apply: true }),
  };
});

describe('S3 add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 's3-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      await applyTerraformCore(awsOptions);
      await applyTerraformAwsProvider(awsOptions);
      await applyAwsS3(awsOptions);
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
        'modules/s3/main.tf',
        'modules/s3/variables.tf',
        'modules/s3/outputs.tf',
        'modules/s3/bucket_policy/main.tf',
        'modules/s3/bucket_policy/variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });
  });
});
