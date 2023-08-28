import { prompt } from 'inquirer';

import { GeneralOptions } from '@/commands/generate';
import { remove } from '@/helpers/file';

import { applyVersionControl } from '.';

jest.mock('inquirer');

describe('Version control add-on', () => {
  describe('given versionControlEnabled is true', () => {
    describe('given github service', () => {
      const projectDir = 'version-control-github-addon-test';

      beforeAll(() => {
        const generalOptions: GeneralOptions = {
          projectName: projectDir,
          provider: 'aws',
        };

        (prompt as unknown as jest.Mock).mockResolvedValue({
          versionControlEnabled: true,
          versionControlService: 'github',
        });

        applyVersionControl(generalOptions);
      });

      afterAll(() => {
        remove('/', projectDir);
      });

      it('creates expected files', () => {
        const expectedFiles = [
          '.github/ISSUE_TEMPLATE/bug_template.md',
          '.github/ISSUE_TEMPLATE/chore_template.md',
          '.github/ISSUE_TEMPLATE/feature_template.md',
          '.github/ISSUE_TEMPLATE/story_template.md',
          '.github/PULL_REQUEST_TEMPLATE/release_template.md',
          '.github/workflows/lint.yml',
          '.github/PULL_REQUEST_TEMPLATE.md',
        ];

        expect(projectDir).toHaveFiles(expectedFiles);
      });
    });

    describe('given versionControlEnabled is false', () => {
      const projectDir = 'version-control-none-addon-test';

      beforeAll(() => {
        const generalOptions: GeneralOptions = {
          projectName: projectDir,
          provider: 'aws',
        };

        (prompt as unknown as jest.Mock).mockResolvedValueOnce({
          versionControlEnabled: false,
        });

        applyVersionControl(generalOptions);
      });

      afterAll(() => {
        remove('/', projectDir);
      });

      it('does NOT create any files', () => {
        expect(projectDir).toBeEmpty();
      });
    });
  });
});
