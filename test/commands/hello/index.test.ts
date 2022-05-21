import {expect, test} from '@oclif/test'
import * as inquirer from 'inquirer'
import * as sinon from 'sinon'

describe('running command generate', () => {
  const stubResp = sinon.stub()
  .onFirstCall()
  .resolves({name: 'aws'})
  .onSecondCall()
  .resolves({infrastructureType: 'basic'})

  test
  .stdout()
  .stub(inquirer, 'prompt', stubResp)
  .command(['generate'])
  .it('lists cloud provider', async (_, done) => {
    done()
  })
})
