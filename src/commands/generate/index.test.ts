import { existsSync, removeSync } from 'fs-extra';
import { prompt } from 'inquirer';

import Generator from '.';

jest.mock('inquirer');

describe('running command generate directly', () => {
  const projectDir = 'app-name';
  const stdoutSpy = jest.spyOn(process.stdout, 'write');

  beforeEach(async() => {
    (prompt as unknown as jest.Mock)
      .mockResolvedValueOnce({ provider: 'aws' })
      .mockResolvedValueOnce({ infrastructureType: 'advanced' });

    await Generator.run([projectDir]);
  });

  afterEach(() => {
    jest.resetAllMocks();
    removeSync(projectDir);
  });

  it('creates a new project folder', () => {
    expect(existsSync(projectDir)).toBe(true);
  });

  it('displays the success message', () => {
    expect(stdoutSpy).toHaveBeenCalledWith('The infrastructure has been generated!\n');
  });
});
