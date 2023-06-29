import { remove } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import { applyCore } from '@/templates/core';

import applyCloudwatch, {
  cloudwatchModuleContent,
  cloudwatchVariablesContent,
} from './cloudwatch';
import applyCommon from './core/common';

jest.mock('inquirer', () => {
  return {
    prompt: jest.fn().mockResolvedValue({ apply: true }),
  };
});

describe('Cloudwatch add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'cloudwatch-addon-test';

    beforeAll(async () => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      await applyCore(awsOptions);
      await applyCommon(awsOptions);
      await applyCloudwatch(awsOptions);
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
        'modules/cloudwatch/main.tf',
        'modules/cloudwatch/variables.tf',
        'modules/cloudwatch/outputs.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds cloudwatch module to main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/main.tf',
        cloudwatchModuleContent
      );
    });

    it('adds cloudwatch variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/variables.tf',
        cloudwatchVariablesContent
      );
    });
  });
});
