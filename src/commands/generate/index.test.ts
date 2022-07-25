import { existsSync } from 'fs-extra';
import { prompt } from 'inquirer';

import Generator from '.';
import { remove } from '../../helpers/file';

jest.mock('inquirer');

describe('running command generate directly', () => {
  const projectDir = 'app-name';
  const stdoutSpy = jest.spyOn(process.stdout, 'write');

  beforeEach(() => {
    (prompt as unknown as jest.Mock)
      .mockResolvedValueOnce({ provider: 'aws' })
      .mockResolvedValueOnce({ infrastructureType: 'advanced' });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates a new project folder', async() => {
    await Generator.run([projectDir]);

    expect(existsSync(projectDir)).toBe(true);

    remove('/', projectDir);
  });

  it('displays the success message', async() => {
    await Generator.run([projectDir]);

    expect(stdoutSpy).toHaveBeenCalledWith('The infrastructure has been generated!\n');

    remove('/', projectDir);
  });
});
