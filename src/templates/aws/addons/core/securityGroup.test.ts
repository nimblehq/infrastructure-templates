import { remove } from '@/helpers/file';
import { AwsOptions } from '@/templates/aws';
import { applyCore } from '@/templates/core';

import applyCommon from './common';
import applySecurityGroup, {
  securityGroupModuleContent,
  securityGroupVariablesContent,
} from './securityGroup';

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn().mockResolvedValue({ apply: true }),
  };
});

describe('Security group add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'security-group-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      await applyCore(awsOptions);
      await applyCommon(awsOptions);
      await applySecurityGroup(awsOptions);
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
        'modules/security_group/main.tf',
        'modules/security_group/variables.tf',
        'modules/security_group/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds security group module to main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/main.tf',
        securityGroupModuleContent
      );
    });

    it('adds security group variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/variables.tf',
        securityGroupVariablesContent
      );
    });
  });
});
