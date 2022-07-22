import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import applyAlb from './alb';
import applyCommon from './common';

describe('alb add-on', () => {
  const projectName = 'projectName';

  afterEach(() => {
    jest.clearAllMocks();
    remove('/', projectName);
  });

  describe('given valid AwsOptions', () => {
    beforeEach(() => {
      const awsOptions: AwsOptions = { projectName, provider: 'aws', infrastructureType: 'basic', awsRegion: 'ap-southeast-1' };

      applyCommon(awsOptions);
      applyAlb(awsOptions);
    });

    it('creates expected files', () => {
      expect(projectName).toHaveFiles(['main.tf', 'providers.tf', 'outputs.tf', 'variables.tf', 'modules/alb/main.tf']);
    });

    it('creates expected folders', () => {
      expect(projectName).toHaveDirectory('modules/alb/');
    });

    it('adds alb to main.tf', () => {
      expect(projectName).toHaveContentInFile('main.tf', 'module "alb" {');
    });
  });
});
