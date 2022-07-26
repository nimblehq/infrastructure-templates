import { runCommand } from './childProcess';

describe('ChildProcess helper', () => {
  describe('runCommand', () => {
    describe('given a valid command', () => {
      it('runs the command', async() => {
        const result = await runCommand('echo', ['hello']);

        expect(result).toBe('hello');
      });
    });

    describe('given an INVALID command', () => {
      it('throws an error', async() => {
        let result: string;
        const invalidCommand = 'invalid-command';

        try {
          result = await runCommand(invalidCommand, []);
        } catch (err) {
          result = (err as Error).message;
        }

        expect(result).toBe(`spawn ${invalidCommand} ENOENT`);
      });
    });
  });
});
