import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import applyAlb from './alb';
import applyCommon from './common';

describe('alb add-on', () => {
  describe('given valid AwsOptions', () => {
    const projectDir = 'projectDir';

    beforeEach(() => {
      const awsOptions: AwsOptions = { projectName: projectDir, provider: 'aws', infrastructureType: 'advanced', awsRegion: 'ap-southeast-1' };

      applyCommon(awsOptions);
      applyAlb(awsOptions);
    });

    afterEach(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      expect(projectDir).toHaveFiles(['main.tf', 'providers.tf', 'outputs.tf', 'variables.tf', 'modules/alb/main.tf']);
    });

    it('creates expected folders', () => {
      expect(projectDir).toHaveDirectory('modules/alb/');
    });

    it('adds alb to main.tf', () => {
      expect(projectDir).toHaveContentInFile('main.tf', 'module "alb" {');
    });
  });
});
