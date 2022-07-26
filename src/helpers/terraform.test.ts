import { runCommand } from './child-process';
import { detectTerraform, formatCode } from './terraform';

jest.mock('./child-process');

describe('Terraform helper', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('detectTerraform', () => {
    describe('given terraform is installed', () => {
      it('returns true', async() => {
        (runCommand as jest.Mock).mockResolvedValueOnce('');

        const result = await detectTerraform();

        expect(result).toBe(true);
      });
    });

    describe('given terraform is not installed', () => {
      it('returns false', async() => {
        (runCommand as jest.Mock).mockRejectedValueOnce(new Error('terraform not found'));

        const result = await detectTerraform();

        expect(result).toBe(false);
      });

      it('displays the error message', async() => {
        (runCommand as jest.Mock).mockRejectedValueOnce(new Error('terraform not found'));
        const consoleSpy = jest.spyOn(global.console, 'error');

        await detectTerraform();

        expect(consoleSpy).toHaveBeenCalledWith('Terraform not found. Please install terraform.');
      });
    });
  });

  describe('formatCode', () => {
    describe('given terraform is installed', () => {
      it('runs terraform fmt', async() => {
        (runCommand as jest.Mock).mockResolvedValueOnce('');

        await formatCode('/');

        expect(runCommand).toHaveBeenCalledWith('terraform', ['fmt'], '/');
      });
    });

    describe('given terraform is not installed', () => {
      it('displays the error message', async() => {
        (runCommand as jest.Mock).mockRejectedValueOnce(new Error('terraform not found'));
        const consoleSpy = jest.spyOn(global.console, 'error');

        await formatCode('/');

        expect(consoleSpy).toHaveBeenCalledWith(Error('terraform not found'));
      });
    });
  });
});
