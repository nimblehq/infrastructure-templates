import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import applyCommon from './common';
import applyEcs, { ecsModuleContent, ecsVariablesContent } from './ecs';

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

      applyCommon(awsOptions);
      applyEcs(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = [
        'main.tf',
        'providers.tf',
        'outputs.tf',
        'variables.tf',
        'modules/ecs/main.tf',
        'modules/ecs/variables.tf',
        'modules/ecs/service.json.tftpl',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds ECS module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('main.tf', ecsModuleContent);
    });

    it('adds ECS variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'variables.tf',
        ecsVariablesContent
      );
    });
  });
});
