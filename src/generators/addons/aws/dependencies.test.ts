import { prompt } from 'inquirer';

import { AwsOptions } from '@/generators/addons/aws';
import {
  applyTerraformAwsProvider,
  applyAwsVpc,
} from '@/generators/addons/aws/modules';
import { applyTerraformCore } from '@/generators/core';
import { remove } from '@/helpers/file';

import { isAwsModuleAdded, requireAwsModules } from './dependencies';

jest.mock('inquirer');

describe('Dependencies', () => {
  const projectDir = 'dependencies-test';

  afterEach(() => {
    jest.clearAllMocks();
    remove('/', projectDir);
  });

  describe('.isAwsModuleAdded', () => {
    describe('given an installed module name', () => {
      it('returns true', () => {
        const options: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
        };

        applyTerraformCore(options);
        applyAwsVpc(options);

        expect(isAwsModuleAdded('vpc', options.projectName)).toBe(true);
      });
    });

    describe('given a NOT installed module name', () => {
      it('returns false', () => {
        const options: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
        };

        expect(isAwsModuleAdded('vpc', options.projectName)).toBe(false);
      });
    });

    describe('given an INVALID module name', () => {
      it('throws an error', () => {
        const options: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
        };

        expect(() => isAwsModuleAdded('azure', options.projectName)).toThrow(
          "Module 'azure' is not supported"
        );
      });
    });
  });

  describe('.requireAwsModule', () => {
    describe('given a valid module name that is already installed', () => {
      it('returns true', async () => {
        const options: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
        };

        await applyTerraformCore(options);
        await applyTerraformAwsProvider(options);
        await applyAwsVpc(options);

        expect(await requireAwsModules('alb', 'vpc', options)).toBe(true);
      });
    });

    describe('given a valid module name that is NOT installed', () => {
      describe('given the default options', () => {
        describe('given the user confirms to add the module', () => {
          it('returns true', async () => {
            const options: AwsOptions = {
              projectName: projectDir,
              provider: 'aws',
              infrastructureType: 'advanced',
            };

            await applyTerraformCore(options);
            await applyTerraformAwsProvider(options);

            (prompt as unknown as jest.Mock).mockResolvedValue({
              apply: true,
            });

            expect(await requireAwsModules('alb', 'vpc', options)).toBe(true);
          });
        });

        describe('given the user confirms to NOT add the module', () => {
          it('throws an error', async () => {
            const options: AwsOptions = {
              projectName: projectDir,
              provider: 'aws',
              infrastructureType: 'advanced',
            };

            await applyTerraformCore(options);
            await applyTerraformAwsProvider(options);

            (prompt as unknown as jest.Mock).mockResolvedValue({
              apply: false,
            });

            await expect(
              requireAwsModules('alb', 'vpc', options)
            ).rejects.toThrow(
              `Module 'vpc' is required before adding 'alb' module`
            );
          });
        });
      });

      describe('given the skipConfirmation option is true', () => {
        it('returns true', async () => {
          const options: AwsOptions = {
            projectName: projectDir,
            provider: 'aws',
            infrastructureType: 'advanced',
          };

          await applyTerraformCore(options);
          await applyTerraformAwsProvider(options);

          expect(
            await requireAwsModules('alb', 'vpc', options, {
              skipConfirmation: true,
            })
          ).toBe(true);
        });
      });
    });

    describe('given an INVALID module name', () => {
      it('throws an error', async () => {
        const options: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
        };

        await applyTerraformCore(options);
        await applyTerraformAwsProvider(options);
        await applyAwsVpc(options);

        await expect(
          requireAwsModules('alb', ['vpc', 'azure'], options)
        ).rejects.toThrow(`Module 'azure' is not supported`);
      });
    });
  });
});
