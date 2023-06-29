import { remove } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import { applyCore } from '@/templates/core';

import applyCommon from './core/common';
import applyRds, {
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
        awsRegion: 'ap-southeast-1',
      };

      await applyCore(awsOptions);
      await applyCommon(awsOptions);
      await applyRds(awsOptions);
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
        'modules/rds/main.tf',
        'modules/rds/variables.tf',
        'modules/rds/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds RDS module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('base/main.tf', rdsModuleContent);
    });

    it('adds RDS variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/variables.tf',
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
