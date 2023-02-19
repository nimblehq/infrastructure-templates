import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import { applyCore } from '../../core';
import applyCommon from './core/common';
import applySecurityGroup from './core/securityGroup';
import applyEcs, {
  ecsModuleContent,
  ecsSGMainContent,
  ecsSGOutputsContent,
  ecsVariablesContent,
} from './ecs';

describe('ECS add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'ecs-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
        awsRegion: 'ap-southeast-1',
      };

      applyCore(awsOptions);
      applyCommon(awsOptions);
      applySecurityGroup(awsOptions); // TODO: Add test to require this
      applyEcs(awsOptions);
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
        'modules/ecs/main.tf',
        'modules/ecs/variables.tf',
        'modules/ecs/service.json.tftpl',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds ECS module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('base/main.tf', ecsModuleContent);
    });

    it('adds ECS variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'base/variables.tf',
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
