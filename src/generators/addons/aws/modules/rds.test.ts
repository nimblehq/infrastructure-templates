import { AwsOptions } from '@/generators/addons/aws';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import applyTerraformAwsProvider from './core/provider';
import applyAwsRds, {
  rdsModuleContent,
  rdsSGMainContent,
  rdsSGOutputsContent,
  rdsVariablesContent,
} from './rds';

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn().mockResolvedValue({ apply: true }),
  };
});

describe('RDS add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'rds-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      await applyTerraformCore(awsOptions);
      await applyTerraformAwsProvider(awsOptions);
      await applyAwsRds(awsOptions);
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
        'modules/rds/main.tf',
        'modules/rds/variables.tf',
        'modules/rds/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds RDS module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('core/main.tf', rdsModuleContent);
    });

    it('adds RDS variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/variables.tf',
        rdsVariablesContent
      );
    });

    it('adds RDS security group main content to security group main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'modules/security_group/main.tf',
        rdsSGMainContent
      );
    });

    it('adds RDS security group outputs content to security group main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'modules/security_group/outputs.tf',
        rdsSGOutputsContent
      );
    });
  });
});
