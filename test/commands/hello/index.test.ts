import {expect, test} from '@oclif/test'

describe('running command generate', () => {
  test
  .stdout()
  .command(['generate'])
  .it('runs generate command', ctx => {
    expect(ctx.stdout).to.contain('What kind of infrastructure you need?')
  })
})
