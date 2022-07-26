import {
  toHaveFile,
  toHaveFiles,
  toHaveDirectory,
  toHaveDirectories,
  toHaveContentInFile,
} from './file';

const matchers = {
  toHaveFile,
  toHaveFiles,
  toHaveDirectory,
  toHaveDirectories,
  toHaveContentInFile,
};

expect.extend(matchers);
