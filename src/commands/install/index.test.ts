import { prompt } from 'inquirer';

import Generator from '@/commands/generate';
import { remove } from '@/helpers/file';
import { postProcess } from '@/hooks/postProcess';

import InstallAddon from '.';

jest.mock('inquirer');
jest.mock('@/hooks/postProcess');

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
          `--project=${projectDir}`,
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
          `The 'vpc' module has been installed to '${projectDir}' project successfully!\n`
        );
      });

      it('calls postProcess hook', () => {
        // One call for the generator and one for the add-on installation
        expect(postProcess).toHaveBeenCalledTimes(2);
      });
    });

    describe('given an INVALID add-on', () => {
      const projectDir = 'aws-install-invalid-addon-test';
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
          'invalid',
          `--provider=${provider}`,
          `--project=${projectDir}`,
        ]);
      });

      afterAll(() => {
        jest.resetAllMocks();
        remove('/', projectDir);
      });

      it('throws an error', async () => {
        expect(stdoutSpy).toHaveBeenCalledWith(
          expect.stringContaining(
            'Expected invalid to be one of: vpc, securityGroup, alb, bastion, ecr, ecs, cloudwatch, rds, s3, ssm'
          )
        );
      });
    });
  });
});
