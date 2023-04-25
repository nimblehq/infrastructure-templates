import { prompt } from 'inquirer';

import { remove } from '@/helpers/file';
import { formatCode, detectTerraform } from '@/helpers/terraform';

import Generator from '.';

jest.mock('inquirer');
jest.mock('@/helpers/terraform');

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
            'The infrastructure template has been generated successfully!\n'
          );
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

    describe('postProcess', () => {
      const projectDir = 'postProcess-test';

      describe('given current machine had terraform', () => {
        beforeAll(async () => {
          (prompt as unknown as jest.Mock)
            .mockResolvedValueOnce({ provider: 'aws' })
            .mockResolvedValueOnce({ infrastructureType: 'advanced' });

          (detectTerraform as jest.Mock).mockImplementation(() => true);

          await Generator.run([projectDir]);
        });

        afterAll(() => {
          jest.resetAllMocks();
          remove('/', projectDir);
        });

        it('runs formatCode', async () => {
          await expect(formatCode).toHaveBeenCalled();
        });
      });

      describe('given current machine did not have terraform', () => {
        const consoleErrorSpy = jest.spyOn(global.console, 'error');

        beforeAll(async () => {
          (prompt as unknown as jest.Mock)
            .mockResolvedValueOnce({ provider: 'aws' })
            .mockResolvedValueOnce({ infrastructureType: 'advanced' });

          (detectTerraform as jest.Mock).mockImplementation(() => {
            throw new Error('terraform not found');
          });

          await Generator.run([projectDir]);
        });

        afterAll(() => {
          jest.resetAllMocks();
          remove('/', projectDir);
        });

        it('does NOT run formatCode', async () => {
          await expect(formatCode).not.toHaveBeenCalled();
        });

        it('displays the error message', () => {
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            Error('terraform not found')
          );
        });
      });
    });
  });
});
