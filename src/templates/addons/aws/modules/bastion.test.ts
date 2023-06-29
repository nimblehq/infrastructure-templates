import { remove } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import { applyCore } from '@/templates/core';

import applyBastion, {
  bastionModuleContent,
  bastionSGMainContent,
  bastionSGOutputsContent,
  bastionVariablesContent,
} from './bastion';
import applyCommon from './core/common';

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn().mockResolvedValue({ apply: true }),
  };
});

describe('Bastion add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'bastion-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      await applyCore(awsOptions);
      await applyCommon(awsOptions);
      await applyBastion(awsOptions);
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
