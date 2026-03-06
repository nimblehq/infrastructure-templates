import { AwsOptions } from '@/generators/addons/aws';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import applyTerraformAwsProvider from './core/provider';
import applyAwsVpcFlowLog, {
  vpcFlowLogModuleContent,
  vpcFlowLogVariablesContent,
} from './vpcFlowLog';

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn().mockResolvedValue({ apply: true }),
  };
});

describe('VPC Flow Log add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'vpc-flow-log-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      await applyTerraformCore(awsOptions);
      await applyTerraformAwsProvider(awsOptions);
      await applyAwsVpcFlowLog(awsOptions);
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
        'modules/vpc_flow_log/main.tf',
        'modules/vpc_flow_log/variables.tf',
        'modules/vpc_flow_log/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds vpc_flow_log module to main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/main.tf',
        vpcFlowLogModuleContent
      );
    });

    it('adds vpc_flow_log variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/variables.tf',
        vpcFlowLogVariablesContent
      );
    });
  });
});
