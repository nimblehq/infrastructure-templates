import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import { applyCore } from '../../core';
import applyCommon from './common';
import applyEcr, { ecrModuleContent, ecrVariablesContent } from './ecr';

describe('ECR add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'ecr-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      applyCore(awsOptions);
      applyCommon(awsOptions);
      applyEcr(awsOptions);
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
        'modules/ecr/main.tf',
        'modules/ecr/variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds ECR module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('main.tf', ecrModuleContent);
    });

    it('adds ECR variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'variables.tf',
        ecrVariablesContent
      );
    });
  });
});
