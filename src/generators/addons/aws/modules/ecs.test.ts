import { AwsOptions } from '@/generators/addons/aws';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import applyTerraformAwsProvider from './core/provider';
import applyAwsEcs, {
  ecsModuleContent,
  ecsSGMainContent,
  ecsSGOutputsContent,
  ecsVariablesContent,
} from './ecs';

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn().mockResolvedValue({ apply: true }),
  };
});

describe('ECS add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'ecs-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      await applyTerraformCore(awsOptions);
      await applyTerraformAwsProvider(awsOptions);
      await applyAwsEcs(awsOptions);
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
        'modules/ecs/main.tf',
        'modules/ecs/variables.tf',
        'modules/ecs/service.json.tftpl',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds ECS module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('core/main.tf', ecsModuleContent);
    });

    it('adds ECS variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/variables.tf',
        ecsVariablesContent
      );
    });

    it('adds ECS security group main content to security group main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'modules/security_group/main.tf',
        ecsSGMainContent
      );
    });

    it('adds ECS security group outputs content to security group main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'modules/security_group/outputs.tf',
        ecsSGOutputsContent
      );
    });
  });
});
