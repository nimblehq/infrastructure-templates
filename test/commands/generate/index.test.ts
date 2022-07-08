import { test } from '@oclif/test';
import * as inquirer from 'inquirer';
import * as sinon from 'sinon';

describe('running command generate', () => {
  const stubResponse = sinon.stub()
    .onFirstCall()
    .resolves({ platform: 'aws' })
    .onSecondCall()
    .resolves({ infrastructureType: 'advance' });

  test
    .stdout()
    .stub(inquirer, 'prompt', stubResponse)
    .command(['generate'])
    .it('lists cloud provider', async(_, done) => {
      done();
    });
});
