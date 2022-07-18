import { test, expect } from '@oclif/test';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';

describe('running command generate', () => {
  const projectName = 'app-name';

  afterEach(() => {
    jest.resetAllMocks();
    fs.removeSync(projectName);
  });

  const stubResponse = jest.fn();
  stubResponse.mockReturnValueOnce({ platform: 'aws' });
  stubResponse.mockReturnValueOnce({ infrastructureType: 'advanced' });

  test
    .stdout()
    .stub(inquirer, 'prompt', stubResponse)
    .command(['generate', projectName])
    .it('creates a new project folder', () => {
      expect(fs.existsSync(projectName)).to.eq(true);
    });
});
