import { prompt } from 'inquirer';

import { remove } from '@/helpers/file';
import { AwsOptions } from '@/templates/aws';
import { applyCommon, applyVpc } from '@/templates/aws/addons';

import { applyCore } from '.';
import { isAWSModuleAdded, requireAWSModules } from './dependencies';

jest.mock('inquirer');

describe('Dependencies', () => {
  const projectDir = 'dependencies-test';

  afterEach(() => {
    jest.clearAllMocks();
    remove('/', projectDir);
  });

  describe('.isAWSModuleAdded', () => {
    describe('given valid module name', () => {
      describe('when module is added', () => {
        it('returns true', () => {
          const options: AwsOptions = {
            projectName: projectDir,
            provider: 'aws',
            infrastructureType: 'advanced',
            awsRegion: 'ap-southeast-1',
          };

          applyCore(options);
          applyVpc(options);

          expect(isAWSModuleAdded('vpc', options.projectName)).toBe(true);
        });
      });

      describe('when module is not added', () => {
        it('returns false', () => {
          const options: AwsOptions = {
            projectName: projectDir,
            provider: 'aws',
            infrastructureType: 'advanced',
            awsRegion: 'ap-southeast-1',
          };

          expect(isAWSModuleAdded('vpc', options.projectName)).toBe(false);
        });
      });
    });

    describe('given INVALID module name', () => {
      it('throws an error', () => {
        const options: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
          awsRegion: 'ap-southeast-1',
        };

        expect(() => isAWSModuleAdded('azure', options.projectName)).toThrow(
          'Module `azure` is not supported'
        );
      });
    });
  });

  describe('.requireAWSModule', () => {
    describe('given valid module name', () => {
      describe('when module was added', () => {
        it('returns true', async () => {
          const options: AwsOptions = {
            projectName: projectDir,
            provider: 'aws',
            infrastructureType: 'advanced',
            awsRegion: 'ap-southeast-1',
          };

          await applyCore(options);
          await applyCommon(options);
          await applyVpc(options);

          expect(await requireAWSModules('alb', 'vpc', options)).toBe(true);
        });
      });

      describe('when module was not added', () => {
        describe('when user chooses to add module', () => {
          it('returns true', async () => {
            const options: AwsOptions = {
              projectName: projectDir,
              provider: 'aws',
              infrastructureType: 'advanced',
              awsRegion: 'ap-southeast-1',
            };

            await applyCore(options);
            await applyCommon(options);

            (prompt as unknown as jest.Mock).mockResolvedValue({
              apply: true,
            });

            expect(await requireAWSModules('alb', 'vpc', options)).toBe(true);
          });
        });

        describe('when user chooses not to add module', () => {
          it('throws an error', async () => {
            const options: AwsOptions = {
              projectName: projectDir,
              provider: 'aws',
              infrastructureType: 'advanced',
              awsRegion: 'ap-southeast-1',
            };

            await applyCore(options);
            await applyCommon(options);

            (prompt as unknown as jest.Mock).mockResolvedValue({
              apply: false,
            });

            expect(requireAWSModules('alb', 'vpc', options)).rejects.toThrow(
              'Module `vpc` is required before adding `alb` module'
            );
          });
        });
      });
    });

    describe('given INVALID module name', () => {
      it('throws an error', async () => {
        const options: AwsOptions = {
          projectName: projectDir,
          provider: 'aws',
          infrastructureType: 'advanced',
          awsRegion: 'ap-southeast-1',
        };

        await applyCore(options);
        await applyCommon(options);
        await applyVpc(options);

        expect(
          requireAWSModules('alb', ['vpc', 'azure'], options)
        ).rejects.toThrow('Module `azure` is not supported');
      });
    });
  });
});
