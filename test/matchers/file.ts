import { readFileSync } from 'fs-extra';
import { sync } from 'glob';
import { diff } from 'jest-diff';

const toBeEmpty = (projectDir: string) => {
  const actualFiles = sync(`**/*.*`, { cwd: projectDir, dot: true });

  const pass = actualFiles.length === 0;

  return {
    pass,
    message: pass
      ? () => `expected ${projectDir} to not be empty`
      : () => `expected ${projectDir} to be empty`,
  };
};

const toHaveFile = (projectDir: string, expectedFile: string) => {
  const actualFiles = sync(`**/*.*`, { cwd: projectDir, dot: true });
  const pass = actualFiles.includes(expectedFile);

  return {
    pass,
    message: pass
      ? () => `expected ${projectDir} to not include ${expectedFile}`
      : () => `expected ${projectDir} to include ${expectedFile}`,
  };
};

const toHaveFiles = (projectDir: string, expectedFiles: string[]) => {
  if (!Array.isArray(expectedFiles)) {
    throw new Error('Expected files must be an array');
  }

  const actualFiles = sync(`**/*.*`, { cwd: projectDir, dot: true });
  const pass = expectedFiles.every((file) => actualFiles.includes(file));
  const diffs = diff(expectedFiles, actualFiles, { expand: false });

  return {
    pass,
    message: pass
      ? () => `expected ${projectDir} not to have [${expectedFiles}]\n${diffs}`
      : () => `expected ${projectDir} to have [${expectedFiles}]\n${diffs}`,
  };
};

const toHaveDirectory = (projectDir: string, expectedDirectory: string) => {
  const actualDirectories = sync(`**/`, { cwd: projectDir, dot: true });

  const pass = actualDirectories.includes(expectedDirectory);

  return {
    pass,
    message: pass
      ? () => `expected ${projectDir} to not include "${expectedDirectory}"`
      : () => `expected ${projectDir} to include "${expectedDirectory}"`,
  };
};

const toHaveDirectories = (
  projectDir: string,
  expectedDirectories: string[]
) => {
  if (!Array.isArray(expectedDirectories)) {
    throw new Error('Expected directories must be an array');
  }

  const actualDirectories = sync(`**/`, { cwd: projectDir, dot: true });
  const pass = expectedDirectories.every((directory) =>
    actualDirectories.includes(directory)
  );
  const diffs = diff(expectedDirectories, actualDirectories, { expand: false });

  return {
    pass,
    message: pass
      ? () =>
          `expected ${projectDir} not to have "${expectedDirectories}"\n${diffs}`
      : () =>
          `expected ${projectDir} to have "${expectedDirectories}"\n${diffs}`,
  };
};

const toHaveContentInFile = (
  projectDir: string,
  expectedFile: string,
  expectedContent: string | string[]
) => {
  let expectedContentArray: string[];
  if (!Array.isArray(expectedContent)) {
    expectedContentArray = [expectedContent];
  } else {
    expectedContentArray = expectedContent;
  }

  const actualContent = readFileSync(`${projectDir}/${expectedFile}`, 'utf8');
  const pass = expectedContentArray.every((content) =>
    actualContent.includes(content)
  );

  return {
    pass,
    message: pass
      ? () =>
          `expected ${projectDir} to not have "${expectedContent}" in "${expectedFile}"`
      : () =>
          `expected ${projectDir} to have "${expectedContent}" in "${expectedFile}"`,
  };
};

export {
  toBeEmpty,
  toHaveContentInFile,
  toHaveDirectories,
  toHaveDirectory,
  toHaveFile,
  toHaveFiles,
};
