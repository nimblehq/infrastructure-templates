import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import { applyCore } from '../../core';
import applyBastion, {
  bastionModuleContent,
  bastionVariablesContent,
} from './bastion';
import applyCommon from './common';

describe('Bastion add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'bastion-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      applyCore(awsOptions);
      applyCommon(awsOptions);
      applyBastion(awsOptions);
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
        'modules/bastion/main.tf',
        'modules/bastion/variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds bastion module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('main.tf', bastionModuleContent);
    });

    it('adds bastion variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'variables.tf',
        bastionVariablesContent
      );
    });
  });
});
