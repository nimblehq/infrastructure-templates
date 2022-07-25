import { existsSync, removeSync } from 'fs-extra';
import { prompt } from 'inquirer';

import Generator from '.';

jest.mock('inquirer');

describe('running command generate directly', () => {
  const projectName = 'app-name';
  const stdoutSpy = jest.spyOn(process.stdout, 'write');

  beforeEach(() => {
    (prompt as unknown as jest.Mock)
      .mockResolvedValueOnce({ provider: 'aws' })
      .mockResolvedValueOnce({ infrastructureType: 'advanced' });
  });

  afterEach(() => {
    jest.resetAllMocks();
    removeSync(projectName);
  });

  it('creates a new project folder', async() => {
    await Generator.run([projectName]);

    expect(existsSync(projectName)).toBe(true);
  });

  it('displays the success message', async() => {
    await Generator.run([projectName]);

    expect(stdoutSpy).toHaveBeenCalledWith('The infrastructure has been generated!\n');
  });
});
