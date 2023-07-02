import { remove } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import { applyTerraformCore } from '@/templates/core';

import applyTerraformAWS from './common';
import applyIamUserAndGroup, {
  iamVariablesContent,
  iamGroupsModuleContent,
  iamUsersModuleContent,
  iamGroupMembershipModuleContent,
  iamOutputsContent,
} from './iamUserAndGroup';

describe('IAM add-on', () => {
  describe('given valid AWS options', () => {
    const projectDir = 'iam-addon-test';

    beforeAll(() => {
      const awsOptions: AwsOptions = {
        projectName: projectDir,
        provider: 'aws',
        infrastructureType: 'advanced',
      };

      applyTerraformCore(awsOptions);
      applyTerraformAWS(awsOptions);
      applyIamUserAndGroup(awsOptions);
    });

    afterAll(() => {
      jest.clearAllMocks();
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = [
        'shared/main.tf',
        'shared/providers.tf',
        'shared/outputs.tf',
        'shared/variables.tf',

        'modules/iam_groups/data.tf',
        'modules/iam_groups/main.tf',
        'modules/iam_groups/outputs.tf',

        'modules/iam_users/main.tf',
        'modules/iam_users/variables.tf',
        'modules/iam_users/outputs.tf',

        'modules/iam_group_membership/main.tf',
        'modules/iam_group_membership/variables.tf',
      ];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds IAM groups module to main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'shared/main.tf',
        iamGroupsModuleContent
      );
    });

    it('adds IAM users module to main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'shared/main.tf',
        iamUsersModuleContent
      );
    });

    it('adds IAM group membership module to main.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'shared/main.tf',
        iamGroupMembershipModuleContent
      );
    });

    it('adds IAM variables to variables.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'shared/variables.tf',
        iamVariablesContent
      );
    });

    it('adds IAM outputs to outputs.tf', () => {
      expect(projectDir).toHaveContentInFile(
        'shared/outputs.tf',
        iamOutputsContent
      );
    });
  });
});
