import { spawn } from 'node:child_process';

const runCommand = (
  command: string,
  args: string[],
  cwd = './'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd });
    const output = [] as string[];

    child.stdout.on('data', (chunk) => output.push(chunk));
    child.on('close', () => resolve(output.join('').trim()));
    child.on('error', (error) => reject(error));
  });
};

export { runCommand };
