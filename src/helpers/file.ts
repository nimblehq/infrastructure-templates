import { renameSync } from 'fs';
import path = require('path');

import {
  appendFileSync,
  copySync,
  existsSync,
  readFileSync,
  removeSync,
  writeFileSync,
} from 'fs-extra';

interface InjectToFileOptions {
  insertBefore?: string;
  insertAfter?: string;
}

const ROOT_DIR = path.join(__dirname, '..', '..');

const getProjectPath = (projectName: string): string => {
  return path.join(process.cwd(), projectName);
};

const getProjectFilePath = (file: string, projectName: string): string => {
  return path.join(getProjectPath(projectName), file);
};

const getTemplatePath = (): string => {
  const templateDir =
    process.env.NODE_ENV === 'production' ? 'dist/templates' : 'templates';
  return path.join(ROOT_DIR, templateDir);
};

const getTemplateFilePath = (file: string): string => {
  return path.join(getTemplatePath(), file);
};

const appendToFile = (
  target: string,
  content: string,
  projectName: string
): void => {
  const targetPath = getProjectFilePath(target, projectName);

  appendFileSync(targetPath, `\n${content}\n`);
};

const copy = (source: string, target: string, projectName: string): void => {
  const sourcePath = path.join(getTemplatePath(), source);
  const targetPath = getProjectFilePath(target, projectName);

  copySync(sourcePath, targetPath);
};

const createFile = (
  target: string,
  content: string,
  projectName: string
): void => {
  const targetPath = getProjectFilePath(target, projectName);
  const targetExists = existsSync(targetPath);

  if (!targetExists) {
    writeFileSync(targetPath, content);
  }
};

const remove = (target: string, projectName: string): void => {
  const targetPath = getProjectFilePath(target, projectName);

  removeSync(targetPath);
};

const injectToFile = (
  target: string,
  content: string,
  projectName: string,
  { insertBefore = '', insertAfter = '' }: InjectToFileOptions = {}
): void => {
  const targetPath =
    projectName !== '' ? getProjectFilePath(target, projectName) : target;

  const data = readFileSync(targetPath, 'utf8');
  const lines = data.toString().split('\n');

  if (insertBefore) {
    const index = lines.findIndex((line) => line.includes(insertBefore));
    if (index !== -1) {
      lines.splice(index, 0, content);
    }
  }

  if (insertAfter) {
    const index = lines.findIndex((line) => line.includes(insertAfter));
    if (index !== -1) {
      lines.splice(index + 1, 0, content);
    }
  }

  const newContent = lines.join('\n');
  writeFileSync(targetPath, newContent);
};

const rename = (target: string, newName: string, projectName: string): void => {
  const targetPath = getProjectFilePath(target, projectName);
  const newTargetPath = path.join(path.dirname(targetPath), newName);

  renameSync(targetPath, newTargetPath);
};

const isExisting = (target: string, projectName: string): boolean => {
  const targetPath = getProjectFilePath(target, projectName);

  return existsSync(targetPath);
};

const containsContent = (
  target: string,
  content: string,
  projectName: string
): boolean => {
  if (!isExisting(target, projectName)) {
    return false;
  }

  const targetPath = getProjectFilePath(target, projectName);
  const data = readFileSync(targetPath, 'utf8');
  const lines = data.toString().split('\n');
  const index = lines.findIndex((line) => line.includes(content));

  return index !== -1;
};

export {
  appendToFile,
  copy,
  createFile,
  getProjectFilePath,
  getProjectPath,
  getTemplateFilePath,
  getTemplatePath,
  injectToFile,
  remove,
  rename,
  isExisting,
  containsContent,
};
