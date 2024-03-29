import { AwsOptions } from '@/generators/addons/aws';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import applyTerraformAwsProvider from './provider';
import applyAwsSecurityGroup, {
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
      };

      await applyTerraformCore(awsOptions);
      await applyTerraformAwsProvider(awsOptions);
      await applyAwsSecurityGroup(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = [
        'core/main.tf',
        'core/providers.tf',
        'core/outputs.tf',
        'core/variables.tf',
        'modules/security_group/main.tf',
        'modules/security_group/variables.tf',
        'modules/security_group/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds security group module to main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/main.tf',
        securityGroupModuleContent
      );
    });

    it('adds security group variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/variables.tf',
        securityGroupVariablesContent
      );
    });
  });
});
