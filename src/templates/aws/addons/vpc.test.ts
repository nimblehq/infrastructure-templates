import { AwsOptions } from '..';
import { remove } from '../../../helpers/file';
import applyCommon from './common';
import applyVpc, { vpcModuleContent, vpcOutputsContent } from './vpc';

describe('VPC add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'vpc-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = { projectName: projectDir, provider: 'aws', infrastructureType: 'advanced', awsRegion: 'ap-southeast-1' };

      applyCommon(awsOptions);
      applyVpc(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = ['main.tf', 'providers.tf', 'outputs.tf', 'variables.tf', 'modules/vpc/main.tf', 'modules/vpc/variables.tf', 'modules/vpc/outputs.tf'];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('creates expected folders', () => {
      expect(projectDir).toHaveDirectory('modules/vpc/');
    });

    it('adds VPC module to main.tf', () => {
      expect(projectDir).toHaveContentInFile('main.tf', vpcModuleContent);
    });

    it('adds VPC variables to outputs.tf', () => {
      expect(projectDir).toHaveContentInFile('outputs.tf', vpcOutputsContent);
    });
  });
});
