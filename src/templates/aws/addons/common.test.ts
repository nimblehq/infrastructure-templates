import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import applyCommon from './common';

describe('common add-on', () => {
  const projectDir = 'projectDir';

  afterEach(() => {
    jest.clearAllMocks();
    remove('/', projectDir);
  });

  describe('given valid AwsOptions', () => {
    beforeEach(() => {
      const awsOptions: AwsOptions = { projectName: projectDir, provider: 'aws', infrastructureType: 'basic', awsRegion: 'ap-southeast-1' };

      applyCommon(awsOptions);
    });

    it('creates expected files', () => {
      expect(projectDir).toHaveFiles(['main.tf', 'providers.tf', 'outputs.tf', 'variables.tf']);
    });
  });
});
