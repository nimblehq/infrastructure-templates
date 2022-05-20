import * as fs from 'fs';
import path = require('path');
import { GenerateOption } from '../commands/generate';

const ROOT_DIR = path.join(__dirname, '..', '..');
const TEMPLATE_DIR =
  process.env.NODE_ENV === 'development' ? 'skeleton' : 'dist/skeleton';
const TEMPLATE_PATH = path.join(ROOT_DIR, TEMPLATE_DIR);

const getTargetPath = (file: string, options: GenerateOption): string => {
  const { projectName } = options;
  const targetPath = path.join(process.cwd(), projectName);

  return path.join(targetPath, file);
};

const appendToFile = (
  target: string,
  content: string,
  options: GenerateOption
): void => {
  const targetPath = getTargetPath(target, options);

  fs.appendFileSync(targetPath, content);
};

const copyFile = (
  source: string,
  target: string,
  options: GenerateOption
): void => {
  const sourcePath = path.join(TEMPLATE_PATH, source);
  const targetPath = getTargetPath(target, options);

  fs.copyFileSync(sourcePath, targetPath);
};

const copyDir = (
  source: string,
  target: string,
  options: GenerateOption
): void => {
  const sourcePath = path.join(TEMPLATE_PATH, source);
  const targetPath = getTargetPath(target, options);
  const targetExists = fs.existsSync(targetPath);
  if (!targetExists) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  const files = fs.readdirSync(sourcePath);
  files.forEach((file) => {
    const sourceFile = path.join(source, file);
    const targetFile = path.join(target, file);
    if (fs.lstatSync(path.join(TEMPLATE_PATH, sourceFile)).isDirectory()) {
      copyDir(sourceFile, targetFile, options);
    } else {
      copyFile(sourceFile, targetFile, options);
    }
  });
};

const createFile = (
  target: string,
  content: string,
  options: GenerateOption
): void => {
  const targetPath = getTargetPath(target, options);
  const targetExists = fs.existsSync(targetPath);

  if (!targetExists) {
    fs.writeFileSync(targetPath, content);
  }
};

interface InjectToFileOptions {
  options?: GenerateOption;
  insert_before?: string;
  insert_after?: string;
}

const injectToFile = (
  target: string,
  content: string,
  { insert_before = '', insert_after = '', options }: InjectToFileOptions = {}
): void => {
  const targetPath = options ? getTargetPath(target, options) : target;

  fs.readFile(targetPath, (err, data) => {
    if (err) {
      throw err;
    }

    const lines = data.toString().split('\n');

    if (insert_before) {
      const index = lines.findIndex((line) => line.includes(insert_before));
      if (index !== -1) {
        lines.splice(index, 0, content);
      }
    }

    if (insert_after) {
      const index = lines.findIndex((line) => line.includes(insert_after));
      if (index !== -1) {
        lines.splice(index + 1, 0, content);
      }
    }

    const newContent = lines.join('\n');
    fs.writeFileSync(targetPath, newContent);
  });
};

const renameFile = (
  source: string,
  target: string,
  options: GenerateOption
): void => {
  const sourcePath = getTargetPath(source, options);
  const targetPath = getTargetPath(target, options);
  fs.renameSync(sourcePath, targetPath);
};

export {
  appendToFile,
  copyDir,
  copyFile,
  createFile,
  injectToFile,
  renameFile,
};
