import { AwsOptions } from '@/generators/addons/aws';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import applyAwsAlb, {
  albModuleContent,
  albOutputsContent,
  albSGMainContent,
  albSGOutputsContent,
  albVariablesContent,
} from './alb';
import applyTerraformAwsProvider from './core/provider';

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn().mockResolvedValue({ apply: true }),
  };
});

describe('ALB add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'alb-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      await applyTerraformCore(awsOptions);
      await applyTerraformAwsProvider(awsOptions);
      await applyAwsAlb(awsOptions);
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
        'modules/alb/main.tf',
        'modules/alb/variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds ALB module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('core/main.tf', albModuleContent);
    });

    it('adds ALB variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/variables.tf',
        albVariablesContent
      );
    });

    it('adds ALB outputs to outputs.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/outputs.tf',
        albOutputsContent
      );
    });

    it('adds ALB security group main content to security group main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'modules/security_group/main.tf',
        albSGMainContent
      );
    });

    it('adds ALB security group outputs content to security group main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'modules/security_group/outputs.tf',
        albSGOutputsContent
      );
    });
  });
});
