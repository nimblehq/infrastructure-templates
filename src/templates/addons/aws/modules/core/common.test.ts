import { remove } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';

import applyCommon from './common';

describe('Common add-on', () => {
  describe('given valid AwsOptions', () => {
    const projectDir = 'common-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      await applyCommon(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates the expected file', () => {
      expect(projectDir).toHaveFile('base/providers.tf');
    });
  });
});