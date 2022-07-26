import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import applyCommon from './common';

describe('Common add-on', () => {
  describe('given valid AwsOptions', () => {
    const projectDir = 'common-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'basic',
        awsRegion: 'ap-southeast-1',
      };

      applyCommon(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = [
        'main.tf',
        'providers.tf',
        'outputs.tf',
        'variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });
  });
});
