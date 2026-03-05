import { AwsOptions } from '@/generators/addons/aws';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import applyAwsIamRole from './iamRole';
import applyTerraformAwsProvider from './provider';

describe('IAM Role add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'iam-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      await applyTerraformCore(awsOptions);
      await applyTerraformAwsProvider(awsOptions);
      await applyAwsIamRole(awsOptions);
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

        'modules/iam_role/data.tf',
        'modules/iam_role/variables.tf',
        'modules/iam_role/main.tf',
        'modules/iam_role/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });
  });
});
