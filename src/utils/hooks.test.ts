import { remove } from '@/helpers/file';
import { formatCode, detectTerraform } from '@/helpers/terraform';

import { postProcess } from './hooks';

jest.mock('@/helpers/terraform');

describe('postProcess', () => {
  const projectDir = 'postProcess-test';
  const generalOptions = { projectName: projectDir, provider: 'aws' };

  describe('given the current machine has terraform installed', () => {
    beforeAll(async () => {
      (detectTerraform as jest.Mock).mockImplementation(() => true);

      await postProcess(generalOptions);
    });

    afterAll(() => {
      jest.resetAllMocks();
      remove('/', projectDir);
    });

    it('runs formatCode', async () => {
      await expect(formatCode).toHaveBeenCalled();
    });
  });

  describe('given the current machine does NOT have terraform installed', () => {
    const consoleErrorSpy = jest.spyOn(global.console, 'error');

    beforeAll(async () => {
      (detectTerraform as jest.Mock).mockImplementation(() => {
        throw new Error('terraform not found');
      });

      await postProcess(generalOptions);
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
