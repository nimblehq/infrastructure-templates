import { remove } from '@/helpers/file';
import { AwsOptions } from '@/templates/aws';

import { applyCore } from '.';

describe('Core codebase', () => {
  describe('given valid AwsOptions', () => {
    const projectDir = 'core-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      applyCore(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = [
        '.gitignore',
        '.tool-versions',
        'base/main.tf',
        'base/outputs.tf',
        'base/variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });
  });
});
