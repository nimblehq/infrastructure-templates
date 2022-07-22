import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import applyCommon from './common';

describe('common add-on', () => {
  const projectName = 'projectName';

  afterEach(() => {
    jest.clearAllMocks();
    remove('/', projectName);
  });

  describe('given valid AwsOptions', () => {
    beforeEach(() => {
      const awsOptions: AwsOptions = { projectName, provider: 'aws', infrastructureType: 'basic', awsRegion: 'ap-southeast-1' };

      applyCommon(awsOptions);
    });

    it('creates expected files', () => {
      expect(projectName).toHaveFiles(['main.tf', 'providers.tf', 'outputs.tf', 'variables.tf']);
    });
  });
});
