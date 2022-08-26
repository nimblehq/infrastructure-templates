import {
  toBeEmpty,
  toHaveFile,
  toHaveFiles,
  toHaveDirectory,
  toHaveDirectories,
  toHaveContentInFile,
} from './file';

const matchers = {
  toBeEmpty,
  toHaveFile,
  toHaveFiles,
  toHaveDirectory,
  toHaveDirectories,
  toHaveContentInFile,
};

expect.extend(matchers);
