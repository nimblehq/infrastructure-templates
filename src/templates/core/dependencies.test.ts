import { prompt } from 'inquirer';

import { remove } from '@/helpers/file';
import { AwsOptions } from '@/templates/addons/aws';
import { applyCommon, applyVpc } from '@/templates/addons/aws/modules';

import { applyTerraformCore } from '.';
import { isAWSModuleAdded, requireAWSModules } from './dependencies';

jest.mock('inquirer');

describe('Dependencies', () => {
  const projectDir = 'dependencies-test';

  afterEach(() => {
    jest.clearAllMocks();
    remove('/', projectDir);
  });

  describe('.isAWSModuleAdded', () => {
    describe('given an installed module name', () => {
      it('returns true', () => {
        const options: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
        };

        applyTerraformCore(options);
        applyVpc(options);

        expect(isAWSModuleAdded('vpc', options.projectName)).toBe(true);
      });
    });

    describe('given a NOT installed module name', () => {
      it('returns false', () => {
        const options: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
        };

        expect(isAWSModuleAdded('vpc', options.projectName)).toBe(false);
      });
    });

    describe('given an INVALID module name', () => {
      it('throws an error', () => {
        const options: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
        };

        expect(() => isAWSModuleAdded('azure', options.projectName)).toThrow(
          "Module 'azure' is not supported"
        );
      });
    });
  });

  describe('.requireAWSModule', () => {
    describe('given a valid module name that is already installed', () => {
      it('returns true', async () => {
        const options: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
        };

        await applyTerraformCore(options);
        await applyCommon(options);
        await applyVpc(options);

        expect(await requireAWSModules('alb', 'vpc', options)).toBe(true);
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
            await applyCommon(options);

            (prompt as unknown as jest.Mock).mockResolvedValue({
              apply: true,
            });

            expect(await requireAWSModules('alb', 'vpc', options)).toBe(true);
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
            await applyCommon(options);

            (prompt as unknown as jest.Mock).mockResolvedValue({
              apply: false,
            });

            await expect(
              requireAWSModules('alb', 'vpc', options)
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
          await applyCommon(options);

          expect(
            await requireAWSModules('alb', 'vpc', options, {
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
        await applyCommon(options);
        await applyVpc(options);

        await expect(
          requireAWSModules('alb', ['vpc', 'azure'], options)
        ).rejects.toThrow(`Module 'azure' is not supported`);
      });
    });
  });
});
