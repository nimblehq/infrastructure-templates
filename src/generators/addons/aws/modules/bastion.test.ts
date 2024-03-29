import { AwsOptions } from '@/generators/addons/aws';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import applyAwsBastion, {
  bastionModuleContent,
  bastionSGMainContent,
  bastionSGOutputsContent,
  bastionVariablesContent,
} from './bastion';
import applyTerraformAwsProvider from './core/provider';

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
      };

      await applyTerraformCore(awsOptions);
      await applyTerraformAwsProvider(awsOptions);
      await applyAwsBastion(awsOptions);
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
        'modules/bastion/main.tf',
        'modules/bastion/variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds bastion module to main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/main.tf',
        bastionModuleContent
      );
    });

    it('adds bastion variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/variables.tf',
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
