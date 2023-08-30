import { AwsOptions } from '@/generators/addons/aws';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import applyTerraformAwsProvider from './provider';
import applyAwsVpc, { vpcModuleContent, vpcOutputsContent } from './vpc';

describe('VPC add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'vpc-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      await applyTerraformCore(awsOptions);
      await applyTerraformAwsProvider(awsOptions);
      await applyAwsVpc(awsOptions);
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
        'modules/vpc/main.tf',
        'modules/vpc/variables.tf',
        'modules/vpc/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds VPC module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('core/main.tf', vpcModuleContent);
    });

    it('adds VPC variables to outputs.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'core/outputs.tf',
        vpcOutputsContent
      );
    });
  });
});
