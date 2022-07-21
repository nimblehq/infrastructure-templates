import path = require('path');

import {
  appendFileSync,
  copySync,
  existsSync,
  readFileSync,
  removeSync,
  renameSync,
  writeFileSync,
} from 'fs-extra';

interface InjectToFileOptions {
  insertBefore?: string;
  insertAfter?: string;
}

const ROOT_DIR = path.join(__dirname, '..', '..');
const TEMPLATE_DIR =
  process.env.NODE_ENV === 'development' ? 'skeleton' : 'dist/skeleton';
const TEMPLATE_PATH = path.join(ROOT_DIR, TEMPLATE_DIR);

const getTargetDir = (projectName: string): string => {
  return path.join(process.cwd(), projectName);
};

const getTargetPath = (file: string, projectName: string): string => {
  return path.join(getTargetDir(projectName), file);
};

const getSourcePath = (file: string): string => {
  return path.join(TEMPLATE_PATH, file);
};

const appendToFile = (
  target: string,
  content: string,
  projectName: string,
): void => {
  const targetPath = getTargetPath(target, projectName);

  appendFileSync(targetPath, content);
};

const copy = (
  source: string,
  target: string,
  projectName: string,
): void => {
  const sourcePath = path.join(TEMPLATE_PATH, source);
  const targetPath = getTargetPath(target, projectName);

  copySync(sourcePath, targetPath);
};

const createFile = (
  target: string,
  content: string,
  projectName: string,
): void => {
  const targetPath = getTargetPath(target, projectName);
  const targetExists = existsSync(targetPath);

  if (!targetExists) {
    writeFileSync(targetPath, content);
  }
};

const remove = (target: string, projectName: string): void => {
  const targetPath = getTargetPath(target, projectName);

  removeSync(targetPath);
};

const renameFile = (
  source: string,
  target: string,
  projectName: string,
): void => {
  const sourcePath = getTargetPath(source, projectName);
  const targetPath = getTargetPath(target, projectName);

  renameSync(sourcePath, targetPath);
};

const injectToFile = (
  target: string,
  content: string,
  projectName: string,
  { insertBefore = '', insertAfter = '' }: InjectToFileOptions = {},
): void => {
  const targetPath = projectName !== '' ? getTargetPath(target, projectName) : target;

  const data = readFileSync(targetPath, 'utf8');
  const lines = data.toString().split('\n');

  if (insertBefore) {
    const index = lines.findIndex(line => line.includes(insertBefore));
    if (index !== -1) {
      lines.splice(index, 0, content);
    }
  }

  if (insertAfter) {
    const index = lines.findIndex(line => line.includes(insertAfter));
    if (index !== -1) {
      lines.splice(index + 1, 0, content);
    }
  }

  const newContent = lines.join('\n');
  writeFileSync(targetPath, newContent);
};

export {
  TEMPLATE_PATH,
  getTargetDir,
  getTargetPath,
  getSourcePath,
  appendToFile,
  copy,
  remove,
  createFile,
  injectToFile,
  renameFile,
};
