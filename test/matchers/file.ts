import { readFileSync } from 'fs-extra';
import { sync } from 'glob';
import { diff } from 'jest-diff';

const toHaveFile = (projectName: string, expectedFile: string) => {
  const actualFiles = sync(`**/*.*`, { cwd: projectName });
  const pass = actualFiles.includes(expectedFile);

  return {
    pass,
    message: pass
      ? () => `expected ${projectName} to not include ${expectedFile}`
      : () => `expected ${projectName} to include ${expectedFile}`,
  };
};

const toHaveFiles = (projectName: string, expectedFiles: string[]) => {
  if (!Array.isArray(expectedFiles)) {
    throw new Error('Expected files must be an array');
  }

  const actualFiles = sync(`**/*.*`, { cwd: projectName });
  const pass = expectedFiles.every(file => actualFiles.includes(file));
  const diffs = diff(expectedFiles, actualFiles, { expand: false });

  return {
    pass,
    message: pass
      ? () => `expected ${projectName} not to have [${expectedFiles}]\n${diffs}`
      : () => `expected ${projectName} to have [${expectedFiles}]\n${diffs}`,
  };
};

const toHaveDirectory = (projectName: string, expectedDirectory: string) => {
  const actualDirectories = sync(`**/`, { cwd: projectName });

  const pass = actualDirectories.includes(expectedDirectory);

  return {
    pass,
    message: pass
      ? () => `expected ${projectName} to not include ${expectedDirectory}`
      : () => `expected ${projectName} to include ${expectedDirectory}`,
  };
};

const toHaveDirectories = (projectName: string, expectedDirectories: string[]) => {
  if (!Array.isArray(expectedDirectories)) {
    throw new Error('Expected directories must be an array');
  }

  const actualDirectories = sync(`**/`, { cwd: projectName });
  const pass = expectedDirectories.every(directory => actualDirectories.includes(directory));
  const diffs = diff(expectedDirectories, actualDirectories, { expand: false });

  return {
    pass,
    message: pass
      ? () => `expected ${projectName} not to have [${expectedDirectories}]\n${diffs}`
      : () => `expected ${projectName} to have [${expectedDirectories}]\n${diffs}`,
  };
};

const toHaveContentInFile = (projectName: string, expectedFile: string, expectedContent: string) => {
  const actualContent = readFileSync(`${projectName}/${expectedFile}`, 'utf8');
  const pass = actualContent.includes(expectedContent);

  return {
    pass,
    message: pass
      ? () => `expected ${projectName} to not include ${expectedContent} in ${expectedFile}`
      : () => `expected ${projectName} to include ${expectedContent} in ${expectedFile}`,
  };
};

export { toHaveFile, toHaveFiles, toHaveDirectory, toHaveDirectories, toHaveContentInFile };
