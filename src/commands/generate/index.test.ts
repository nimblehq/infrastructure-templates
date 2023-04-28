import { prompt } from 'inquirer';

import { remove } from '@/helpers/file';
import { postProcess } from '@/utils/hooks';

import Generator from '.';

jest.mock('inquirer');
jest.mock('@/utils/hooks');

describe('Generator command', () => {
  describe('given valid options', () => {
    describe('given provider is AWS', () => {
      describe('given infrastructure type is blank', () => {
        const projectDir = 'aws-blank-test';
        const stdoutSpy = jest.spyOn(process.stdout, 'write');

        beforeAll(async () => {
          (prompt as unknown as jest.Mock)
            .mockResolvedValueOnce({
              provider: 'aws',
              versionControl: 'github',
            })
            .mockResolvedValueOnce({ infrastructureType: 'blank' });

          await Generator.run([projectDir]);
        });

        afterAll(() => {
          jest.resetAllMocks();
          remove('/', projectDir);
        });

        it('creates expected directories', () => {
          const expectedDirectories = ['.github/', 'base/', 'shared/'];

          expect(projectDir).toHaveDirectories(expectedDirectories);
        });

        it('creates expected files', () => {
          const expectedFiles = [
            '.gitignore',
            '.tool-versions',
            'base/main.tf',
            'base/variables.tf',
            'base/providers.tf',
            'base/outputs.tf',
            'shared/main.tf',
            'shared/variables.tf',
            'shared/providers.tf',
            'shared/outputs.tf',
          ];

          expect(projectDir).toHaveFiles(expectedFiles);
        });

        it('displays the success message', () => {
          expect(stdoutSpy).toHaveBeenCalledWith(
            'The infrastructure code was generated at `aws-blank-test`\n'
          );
        });

        it('calls postProcess hook', () => {
          expect(postProcess).toHaveBeenCalledTimes(1);
        });
      });

      describe('given infrastructure type is advanced', () => {
        const projectDir = 'aws-advanced-test';
        const stdoutSpy = jest.spyOn(process.stdout, 'write');

        beforeAll(async () => {
          (prompt as unknown as jest.Mock)
            .mockResolvedValueOnce({
              provider: 'aws',
              versionControl: 'github',
            })
            .mockResolvedValueOnce({ infrastructureType: 'advanced' });

          await Generator.run([projectDir]);
        });

        afterAll(() => {
          jest.resetAllMocks();
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
            '.github/',
          ];

          expect(projectDir).toHaveDirectories(expectedDirectories);
        });

        it('creates expected files', () => {
          const expectedFiles = [
            '.gitignore',
            '.tool-versions',
            'base/main.tf',
            'base/variables.tf',
            'base/providers.tf',
            'base/outputs.tf',
          ];

          expect(projectDir).toHaveFiles(expectedFiles);
        });

        it('displays the success message', () => {
          expect(stdoutSpy).toHaveBeenCalledWith(
            'The infrastructure code was generated at `aws-advanced-test`\n'
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
