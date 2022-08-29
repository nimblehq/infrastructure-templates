import { applyCore } from '.';
import { remove } from '../../helpers/file';
import { AwsOptions } from '../aws';

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
        'main.tf',
        'outputs.tf',
        'variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });
  });
});
