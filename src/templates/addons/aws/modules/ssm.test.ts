import { remove } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import { applyCore } from '@/templates/core';

import applyCommon from './core/common';
import applySsm, { ssmModuleContent, ssmVariablesContent } from './ssm';

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn().mockResolvedValue({ apply: true }),
  };
});

describe('SSM add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'ssm-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      await applyCore(awsOptions);
      await applyCommon(awsOptions);
      await applySsm(awsOptions);
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
        'modules/ssm/main.tf',
        'modules/ssm/variables.tf',
        'modules/ssm/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds SSM module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('base/main.tf', ssmModuleContent);
    });

    it('adds SSM variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/variables.tf',
        ssmVariablesContent
      );
    });
  });
});