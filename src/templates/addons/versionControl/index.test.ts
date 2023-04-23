import { GeneralOptions } from '@/commands/generate';
import { remove } from '@/helpers/file';

import { applyVersionControl } from '.';

describe('Version control add-on', () => {
  describe('given valid GeneralOptions', () => {
    describe('given github version control', () => {
      const projectDir = 'version-control-github-addon-test';

      beforeAll(() => {
        const generalOptions: GeneralOptions = {
          projectName: projectDir,
          provider: 'aws',
          versionControl: 'github',
        };

        applyVersionControl(generalOptions);
      });

      afterAll(() => {
        jest.clearAllMocks();
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

    describe('given none version control', () => {
      const projectDir = 'version-control-none-addon-test';

      beforeAll(() => {
        const generalOptions: GeneralOptions = {
          projectName: projectDir,
          provider: 'aws',
          versionControl: 'none',
        };

        applyVersionControl(generalOptions);
      });

      afterAll(() => {
        jest.clearAllMocks();
        remove('/', projectDir);
      });

      it('does NOT create any files', () => {
        expect(projectDir).toBeEmpty();
      });
    });
  });
});
