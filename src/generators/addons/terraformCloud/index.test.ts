import { prompt } from 'inquirer';

import { GeneralOptions } from '@/commands/generate';
import { applyTerraformCore } from '@/generators/terraform';
import { remove } from '@/helpers/file';

import { applyTerraformCloud } from '.';

jest.mock('inquirer');

describe('Terrafom Cloud add-on', () => {
  describe('given terraformCloudEnabled is true', () => {
    const projectDir = 'terraform-cloud-addon-test';

    beforeAll(() => {
      const generalOptions: GeneralOptions = {
        projectName: projectDir,
        provider: 'aws',
      };

      (prompt as unknown as jest.Mock).mockResolvedValue({
        terraformCloudEnabled: true,
        terraformCloudOrganization: 'YOUR_ORGANIZATION',
        terraformCloudBaseWorkspace: 'YOUR_BASE_WORKSPACE',
        terraformCloudSharedWorkspace: 'YOUR_SHARED_WORKSPACE',
      });

      applyTerraformCore(generalOptions);
      applyTerraformCloud(generalOptions);
    });

    afterAll(() => {
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = ['base/main.tf', 'shared/main.tf'];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('adds the cloud block to main.tf files', () => {
      expect(projectDir).toHaveContentInFile(
        'base/main.tf',
        `
          cloud {
            organization = "YOUR_ORGANIZATION"
            workspaces {
              name = "YOUR_BASE_WORKSPACE"
            }
          }
        `,
        {
          ignoreSpaces: true,
        }
      );
      expect(projectDir).toHaveContentInFile(
        'shared/main.tf',
        `
          cloud {
            organization = "YOUR_ORGANIZATION"
            workspaces {
              name = "YOUR_SHARED_WORKSPACE"
            }
          }
        `,
        { ignoreSpaces: true }
      );
    });
  });

  describe('given terraformCloudEnabled is false', () => {
    const projectDir = 'terraform-cloud-none-addon-test';

    beforeAll(() => {
      const generalOptions: GeneralOptions = {
        projectName: projectDir,
        provider: 'aws',
      };

      (prompt as unknown as jest.Mock).mockResolvedValueOnce({
        terraformCloudEnabled: false,
      });

      applyTerraformCore(generalOptions);
      applyTerraformCloud(generalOptions);
    });

    afterAll(() => {
      remove('/', projectDir);
    });

    it('creates expected files', () => {
      const expectedFiles = ['base/main.tf', 'shared/main.tf'];

      expect(projectDir).toHaveFiles(expectedFiles);
    });

    it('does NOT add the cloud block to main.tf files', () => {
      const expectedContent = 'cloud {';

      expect(projectDir).not.toHaveContentInFile(
        'base/main.tf',
        expectedContent
      );
      expect(projectDir).not.toHaveContentInFile(
        'shared/main.tf',
        expectedContent
      );
    });
  });
});
