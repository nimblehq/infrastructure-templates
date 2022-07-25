import { spawn } from 'node:child_process';

const runCommand = (
  command: string,
  args: string[],
  cwd = './',
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data;
    });

    child.stderr.on('data', (data) => {
      stderr += data;
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(stderr);
      }
    });

    child.on('error', (err) => {
      reject(err);
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(stderr);
      }
    });

    child.on('message', (msg) => {
      resolve(msg as string);
    });
  });
};

export {
  runCommand,
};
