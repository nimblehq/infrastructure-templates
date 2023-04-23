import { remove } from '@/helpers/file';
import { AwsOptions } from '@/templates/aws';
import { applyCore } from '@/templates/core';

import applyCommon from './common';
import applyVpc, { vpcModuleContent, vpcOutputsContent } from './vpc';

describe('VPC add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'vpc-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      await applyCore(awsOptions);
      await applyCommon(awsOptions);
      await applyVpc(awsOptions);
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
        'modules/vpc/main.tf',
        'modules/vpc/variables.tf',
        'modules/vpc/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds VPC module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('base/main.tf', vpcModuleContent);
    });

    it('adds VPC variables to outputs.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/outputs.tf',
        vpcOutputsContent
      );
    });
  });
});
