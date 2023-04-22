import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import { applyCore } from '../../core';
import applyAlb, {
  albModuleContent,
  albOutputsContent,
  albSGMainContent,
  albSGOutputsContent,
  albVariablesContent,
} from './alb';
import applyCommon from './core/common';

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
        awsRegion: 'ap-southeast-1',
      };

      await applyCore(awsOptions);
      await applyCommon(awsOptions);
      await applyAlb(awsOptions);
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
        'modules/alb/main.tf',
        'modules/alb/variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds ALB module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('base/main.tf', albModuleContent);
    });

    it('adds ALB variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/variables.tf',
        albVariablesContent
      );
    });

    it('adds ALB outputs to outputs.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/outputs.tf',
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
