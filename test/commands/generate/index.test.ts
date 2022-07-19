import { test, expect } from '@oclif/test';
import { existsSync, removeSync } from 'fs-extra';
import * as inquirer from 'inquirer';

describe('running command generate', () => {
  const projectName = 'app-name';

  afterEach(() => {
    jest.resetAllMocks();
    removeSync(projectName);
  });

  const stubResponse = jest.fn();
  stubResponse.mockReturnValueOnce({ provider: 'aws' });
  stubResponse.mockReturnValueOnce({ infrastructureType: 'advanced' });

  test
    .stdout()
    .stub(inquirer, 'prompt', stubResponse)
    .command(['generate', projectName])
    .it('creates a new project folder', (ctx) => {
      expect(ctx.stdout).to.contains('The infrastructure has been generated!');
      expect(existsSync(projectName)).to.eq(true);
    });
});
