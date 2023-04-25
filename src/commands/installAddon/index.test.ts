import { prompt } from 'inquirer';

import Generator from '@/commands/generate';
import { remove } from '@/helpers/file';

import InstallAddon from '.';

jest.mock('inquirer');

describe('Install add-on command', () => {
  describe('given AWS provider', () => {
    const provider = 'aws';

    describe('given a valid add-on', () => {
      const projectDir = 'aws-install-valid-addon-test';
      const stdoutSpy = jest.spyOn(process.stdout, 'write');

      beforeAll(async () => {
        (prompt as unknown as jest.Mock)
          .mockResolvedValueOnce({
            provider: provider,
            versionControl: 'github',
          })
          .mockResolvedValueOnce({ infrastructureType: 'blank' });

        await Generator.run([projectDir]);
        await InstallAddon.run([
          'vpc',
          `--provider=${provider}`,
          `--projectName=${projectDir}`,
        ]);
      });

      afterAll(() => {
        jest.resetAllMocks();
        remove('/', projectDir);
      });

      it('creates expected directories', () => {
        const expectedDirectories = [
          '.github/',
          'base/',
          'shared/',
          'modules/',
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
          'shared/main.tf',
          'shared/variables.tf',
          'shared/providers.tf',
          'shared/outputs.tf',
          'modules/vpc/main.tf',
          'modules/vpc/variables.tf',
          'modules/vpc/outputs.tf',
        ];

        expect(projectDir).toHaveFiles(expectedFiles);
      });

      it('displays the success message', () => {
        expect(stdoutSpy).toHaveBeenCalledWith(
          `The \`vpc\` module has been installed to \`${projectDir}\` project successfully!\n`
        );
      });
    });

    describe('given an INVALID add-on', () => {
      const projectDir = 'aws-install-invalid-addon-test';

      beforeAll(async () => {
        (prompt as unknown as jest.Mock)
          .mockResolvedValueOnce({
            provider: provider,
            versionControl: 'github',
          })
          .mockResolvedValueOnce({ infrastructureType: 'blank' });

        await Generator.run([projectDir]);
      });

      afterAll(() => {
        jest.resetAllMocks();
        remove('/', projectDir);
      });

      it('throws an error', async () => {
        await expect(
          InstallAddon.run([
            'invalid',
            `--provider=${provider}`,
            `--projectName=${projectDir}`,
          ])
        ).rejects.toThrowError(
          'Expected invalid to be one of: vpc, securityGroup, alb, bastion, ecr, ecs, cloudwatch, rds, s3, ssm'
        );
      });
    });
  });
});
