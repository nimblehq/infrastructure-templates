import { AwsOptions } from '@/generators/addons/aws';
import { remove } from '@/helpers/file';

import { applyTerraformCore } from '.';

describe('Core codebase', () => {
  describe('given valid AwsOptions', () => {
    const projectDir = 'core-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      applyTerraformCore(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = [
        '.gitignore',
        '.tool-versions',
        'trivy.yaml',
        'core/main.tf',
        'core/outputs.tf',
        'core/variables.tf',
        'shared/main.tf',
        'shared/outputs.tf',
        'shared/variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });
  });
});
