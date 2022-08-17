import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import { applyCore } from '../../core';
import applyCommon from './common';
import applySecurityGroup, {
  securityGroupModuleContent,
  securityGroupVariablesContent,
} from './securityGroup';

describe('Security group add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'security-group-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      applyCore(awsOptions);
      applyCommon(awsOptions);
      applySecurityGroup(awsOptions);
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
        'modules/security_group/main.tf',
        'modules/security_group/variables.tf',
        'modules/security_group/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds security group module to main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'main.tf',
        securityGroupModuleContent
      );
    });

    it('adds security group variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'variables.tf',
        securityGroupVariablesContent
      );
    });
  });
});
