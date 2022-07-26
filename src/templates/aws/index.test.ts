import { prompt } from 'inquirer';

import { generateAwsTemplate } from '.';
import { GeneralOptions } from '../../commands/generate';
import { remove } from '../../helpers/file';
import { applyAdvancedTemplate } from './advanced';

jest.mock('./advanced');
jest.mock('inquirer');

describe('AWS template', () => {
  describe('generateAwsTemplate', () => {
    const projectDir = 'aws-advanced-test';
    const options: GeneralOptions = { projectName: projectDir, provider: 'aws' };

    describe('given infrastructureType is basic', () => {
      beforeAll(() => {
        (prompt as unknown as jest.Mock)
          .mockResolvedValueOnce({ infrastructureType: 'basic' });
      });

      afterAll(() => {
        jest.clearAllMocks();
        remove('/', projectDir);
      });

      it('throws the error message', async() => {
        await expect(generateAwsTemplate(options)).rejects.toThrow('This type has not been implemented!');
      });
    });

    describe('given infrastructureType is advanced', () => {
      beforeAll(() => {
        (prompt as unknown as jest.Mock)
          .mockResolvedValueOnce({ infrastructureType: 'advanced' });
      });

      afterAll(() => {
        jest.clearAllMocks();
        remove('/', projectDir);
      });

      it('applies advanced add-ons', async() => {
        await generateAwsTemplate(options);

        expect(applyAdvancedTemplate).toHaveBeenCalled();
      });
    });
  });
});
