import { applyTerraform } from '.';
import { remove } from '../../../helpers/file';
import { AwsOptions } from '../../aws';

describe('Terraform add-on', () => {
  describe('given valid AwsOptions', () => {
    const projectDir = 'terraform-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      applyTerraform(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = [
        '.tool-versions',
        'main.tf',
        'outputs.tf',
        'variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });
  });
});
