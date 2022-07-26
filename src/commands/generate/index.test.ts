import { existsSync } from 'fs-extra';
import { prompt } from 'inquirer';

import Generator from '.';
import { remove } from '../../helpers/file';
import { formatCode, detectTerraform } from '../../helpers/terraform';

jest.mock('inquirer');
jest.mock('../../helpers/terraform');

describe('Generator command', () => {
  describe('given valid options', () => {
    describe('given provider is AWS', () => {
      describe('given infrastructure type is basic', () => {
        const projectDir = 'aws-basic-test';
        const consoleErrorSpy = jest.spyOn(global.console, 'error');

        beforeAll(async() => {
          (prompt as unknown as jest.Mock)
            .mockResolvedValueOnce({ provider: 'aws' })
            .mockResolvedValueOnce({ infrastructureType: 'basic' });

          await Generator.run([projectDir]);
        });

        afterAll(() => {
          jest.resetAllMocks();
          remove('/', projectDir);
        });

        it('displays the error message', () => {
          expect(consoleErrorSpy).toHaveBeenCalledWith(Error('This type has not been implemented!'));
        });
      });

      describe('given infrastructure type is advanced', () => {
        const projectDir = 'aws-advanced-test';
        const stdoutSpy = jest.spyOn(process.stdout, 'write');

        beforeAll(async() => {
          (prompt as unknown as jest.Mock)
            .mockResolvedValueOnce({ provider: 'aws' })
            .mockResolvedValueOnce({ infrastructureType: 'advanced' });

          await Generator.run([projectDir]);
        });

        afterAll(() => {
          jest.resetAllMocks();
          remove('/', projectDir);
        });

        it('creates a new project folder', () => {
          expect(existsSync(projectDir)).toBe(true);
        });

        it('displays the success message', () => {
          expect(stdoutSpy).toHaveBeenCalledWith('The infrastructure has been generated!\n');
        });
      });
    });

    describe('given provider is GCP', () => {
      const projectDir = 'gcp-test';
      const consoleErrorSpy = jest.spyOn(global.console, 'error');

      beforeAll(async() => {
        (prompt as unknown as jest.Mock)
          .mockResolvedValueOnce({ provider: 'gcp' });

        await Generator.run([projectDir]);
      });

      afterAll(() => {
        jest.resetAllMocks();
        remove('/', projectDir);
      });

      it('displays the error message', () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(Error('This provider has not been implemented!'));
      });
    });

    describe('given provider is Heroku', () => {
      const projectDir = 'heroku-test';
      const consoleErrorSpy = jest.spyOn(global.console, 'error');

      beforeAll(async() => {
        (prompt as unknown as jest.Mock)
          .mockResolvedValueOnce({ provider: 'heroku' });

        await Generator.run([projectDir]);
      });

      afterAll(() => {
        jest.resetAllMocks();
        remove('/', projectDir);
      });

      it('displays the error message', () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(Error('This provider has not been implemented!'));
      });
    });

    describe('postProcess', () => {
      const projectDir = 'postProcess-test';

      describe('given current machine had terraform', () => {
        beforeAll(async() => {
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

        it('runs formatCode', async() => {
          await expect(formatCode).toHaveBeenCalled();
        });
      });

      describe('given current machine did not have terraform', () => {
        const consoleErrorSpy = jest.spyOn(global.console, 'error');

        beforeAll(async() => {
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

        it('does NOT run formatCode', async() => {
          await expect(formatCode).not.toHaveBeenCalled();
        });

        it('displays the error message', () => {
          expect(consoleErrorSpy).toHaveBeenCalledWith(Error('terraform not found'));
        });
      });
    });
  });
});
