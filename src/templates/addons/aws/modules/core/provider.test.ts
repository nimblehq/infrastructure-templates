import { remove } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';

import applyTerraformAwsProvider from './provider';

describe('Provider add-on', () => {
  describe('given valid AwsOptions', () => {
    const projectDir = 'provider-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      await applyTerraformAwsProvider(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates the expected file', () => {
      expect(projectDir).toHaveFile('base/providers.tf');
      expect(projectDir).toHaveFile('shared/providers.tf');
    });
  });
});
