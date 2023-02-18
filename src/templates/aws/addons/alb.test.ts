import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import { applyCore } from '../../core';
import applyAlb, {
  albModuleContent,
  albOutputsContent,
  albVariablesContent,
} from './alb';
import applyCommon from './core/common';

describe('ALB add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'alb-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      applyCore(awsOptions);
      applyCommon(awsOptions);
      applyAlb(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = [
        'base/main.tf',
        'base/providers.tf',
        'base/outputs.tf',
        'base/variables.tf',
        'modules/alb/main.tf',
        'modules/alb/variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds ALB module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('base/main.tf', albModuleContent);
    });

    it('adds ALB variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/variables.tf',
        albVariablesContent
      );
    });

    it('adds ALB outputs to outputs.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/outputs.tf',
        albOutputsContent
      );
    });
  });
});
