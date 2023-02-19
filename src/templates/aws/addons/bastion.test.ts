import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import { applyCore } from '../../core';
import applyBastion, {
  bastionModuleContent,
  bastionSGMainContent,
  bastionSGOutputsContent,
  bastionVariablesContent,
} from './bastion';
import applyCommon from './core/common';
import applySecurityGroup from './core/securityGroup';

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
      applySecurityGroup(awsOptions); // TODO: Add test to require this
      applyBastion(awsOptions);
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
        'modules/bastion/main.tf',
        'modules/bastion/variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds bastion module to main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/main.tf',
        bastionModuleContent
      );
    });

    it('adds bastion variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/variables.tf',
        bastionVariablesContent
      );
    });

    it('adds bastion security group main content to security group main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'modules/security_group/main.tf',
        bastionSGMainContent
      );
    });

    it('adds bastion security group outputs content to security group main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'modules/security_group/outputs.tf',
        bastionSGOutputsContent
      );
    });
  });
});
