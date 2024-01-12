import { prompt } from 'inquirer';

import { remove } from '@/helpers/file';
import { postProcess } from '@/hooks/postProcess';

import Generator from '.';

jest.mock('inquirer');
jest.mock('@/hooks/postProcess');

describe('Generator command', () => {
  describe('given valid options', () => {
    describe('given provider is AWS', () => {
      describe('given infrastructure type is blank', () => {
        const originalDirectoryName = 'AWS blank test';
        const processedDirectoryName = 'aws-blank-test';
        const stdoutSpy = jest.spyOn(process.stdout, 'write');

        beforeAll(async () => {
          (prompt as unknown as jest.Mock).mockResolvedValue({
            provider: 'aws',
            infrastructureType: 'blank',
            versionControlEnabled: false,
            terraformCloudEnabled: false,
          });

          await Generator.run([originalDirectoryName]);
        });

        afterAll(() => {
          jest.clearAllMocks();
          remove('/', processedDirectoryName);
        });

        it('creates expected directories', () => {
          const expectedDirectories = ['core/', 'shared/'];

          expect(processedDirectoryName).toHaveDirectories(expectedDirectories);
        });

        it('creates expected files', () => {
          const expectedFiles = [
            '.gitignore',
            '.tool-versions',
            'core/main.tf',
            'core/variables.tf',
            'core/providers.tf',
            'core/outputs.tf',
            'shared/main.tf',
            'shared/variables.tf',
            'shared/providers.tf',
            'shared/outputs.tf',
          ];

          expect(processedDirectoryName).toHaveFiles(expectedFiles);
        });

        it('displays the success message', () => {
          expect(stdoutSpy).toHaveBeenCalledWith(
            `The infrastructure code was generated at 'aws-blank-test'\n`
          );
        });

        it('calls postProcess hook', () => {
          expect(postProcess).toHaveBeenCalledTimes(1);
        });

        it('contains processed project name in main files', () => {
          const mainFiles = ['shared/main.tf', 'core/main.tf'];
          mainFiles.forEach((fileName) => {
            expect(processedDirectoryName).toHaveContentInFile(
              fileName,
              `project_name = "${processedDirectoryName}"`,
              { ignoreSpaces: true }
            );
          });
        });
      });

      describe('given infrastructure type is advanced', () => {
        const projectDir = 'aws-advanced-test';
        const stdoutSpy = jest.spyOn(process.stdout, 'write');

        beforeAll(async () => {
          (prompt as unknown as jest.Mock).mockResolvedValue({
            provider: 'aws',
            infrastructureType: 'advanced',
            versionControlEnabled: false,
            terraformCloudEnabled: false,
          });

          await Generator.run([projectDir]);
        });

        afterAll(() => {
          jest.clearAllMocks();
          remove('/', projectDir);
        });

        it('creates expected directories', () => {
          const expectedDirectories = [
            'modules/alb/',
            'modules/bastion/',
            'modules/ecr/',
            'modules/ecs/',
            'modules/cloudwatch/',
            'modules/rds/',
            'modules/s3/',
            'modules/security_group/',
            'modules/ssm/',
            'modules/vpc/',
          ];

          expect(projectDir).toHaveDirectories(expectedDirectories);
        });

        it('creates expected files', () => {
          const expectedFiles = [
            '.gitignore',
            '.tool-versions',
            'core/main.tf',
            'core/variables.tf',
            'core/providers.tf',
            'core/outputs.tf',
          ];

          expect(projectDir).toHaveFiles(expectedFiles);
        });

        it('displays the success message', () => {
          expect(stdoutSpy).toHaveBeenCalledWith(
            `The infrastructure code was generated at 'aws-advanced-test'\n`
          );
        });

        it('calls postProcess hook', () => {
          expect(postProcess).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('given provider is other', () => {
      const projectDir = 'other-test';
      beforeAll(async () => {
        (prompt as unknown as jest.Mock).mockResolvedValueOnce({
          provider: 'other',
          versionControlEnabled: false,
          terraformCloudEnabled: false,
        });
      });

      afterEach(() => {
        jest.resetAllMocks();
        remove('/', projectDir);
      });

      it('throws an error message', async () => {
        await expect(Generator.run([projectDir])).rejects.toThrowError(
          'This provider has not been implemented!'
        );
      });
    });
  });
});
