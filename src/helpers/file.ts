import path = require('path');

import {
  appendFileSync, copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, renameSync, rmdirSync, unlinkSync, writeFileSync,

} from 'fs-extra';

const ROOT_DIR = path.join(__dirname, '..', '..');
const TEMPLATE_DIR =
  process.env.NODE_ENV === 'development' ? 'skeleton' : 'dist/skeleton';
const TEMPLATE_PATH = path.join(ROOT_DIR, TEMPLATE_DIR);

const getTargetPath = (file: string, projectName: string): string => {
  const targetPath = path.join(process.cwd(), projectName);

  return path.join(targetPath, file);
};

const appendToFile = (
  target: string,
  content: string,
  projectName: string,
): void => {
  const targetPath = getTargetPath(target, projectName);

  appendFileSync(targetPath, content);
};

const copyFile = (
  source: string,
  target: string,
  projectName: string,
): void => {
  const sourcePath = path.join(TEMPLATE_PATH, source);
  const targetPath = getTargetPath(target, projectName);
  const targetDir = path.dirname(targetPath);
  const targetExists = existsSync(targetPath);
  if (!targetExists) {
    mkdirSync(targetDir, { recursive: true });
  }

  copyFileSync(sourcePath, targetPath);
};

const copyDir = (
  source: string,
  target: string,
  projectName: string,
): void => {
  const sourcePath = path.join(TEMPLATE_PATH, source);
  const targetPath = getTargetPath(target, projectName);
  const targetExists = existsSync(targetPath);
  if (!targetExists) {
    mkdirSync(targetPath, { recursive: true });
  }

  const files = readdirSync(sourcePath);
  for (const file of files) {
    const sourceFile = path.join(source, file);
    const targetFile = path.join(target, file);
    if (lstatSync(path.join(TEMPLATE_PATH, sourceFile)).isDirectory()) {
      copyDir(sourceFile, targetFile, projectName);
    } else {
      copyFile(sourceFile, targetFile, projectName);
    }
  }
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

const deleteFile = (target: string, projectName: string): void => {
  const targetPath = getTargetPath(target, projectName);
  const targetExists = existsSync(targetPath);

  if (targetExists) {
    unlinkSync(targetPath);
  }
};

const deleteDir = (target: string, projectName: string): void => {
  const targetPath = getTargetPath(target, projectName);
  const targetExists = existsSync(targetPath);

  if (targetExists) {
    rmdirSync(targetPath, { recursive: true });
  }
};

interface InjectToFileOptions {
  insertBefore?: string;
  insertAfter?: string;
}

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

const renameFile = (
  source: string,
  target: string,
  projectName: string,
): void => {
  const sourcePath = getTargetPath(source, projectName);
  const targetPath = getTargetPath(target, projectName);
  renameSync(sourcePath, targetPath);
};

export {
  appendToFile,
  copyDir,
  copyFile,
  deleteDir,
  deleteFile,
  createFile,
  injectToFile,
  renameFile,
};
