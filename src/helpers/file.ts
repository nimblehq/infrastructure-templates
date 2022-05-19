import * as fs from 'fs';
import path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');
const TEMPLATE_DIR =
  process.env.NODE_ENV === 'development' ? 'skeleton' : 'dist/skeleton';
const TEMPLATE_PATH = path.join(ROOT_DIR, TEMPLATE_DIR);

const appendToFile = (target: string, content: string): void => {
  fs.appendFileSync(target, content);
};

const copyFile = (source: string, target: string): void => {
  const sourcePath = path.join(TEMPLATE_PATH, source);

  fs.copyFileSync(sourcePath, target);
};

const copyDir = (source: string, target: string): void => {
  const sourcePath = path.join(TEMPLATE_PATH, source);
  const targetExists = fs.existsSync(target);
  if (!targetExists) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(sourcePath);
  files.forEach((file) => {
    const sourceFile = path.join(source, file);
    const targetFile = path.join(target, file);
    if (fs.lstatSync(path.join(TEMPLATE_PATH, sourceFile)).isDirectory()) {
      copyDir(sourceFile, targetFile);
    } else {
      copyFile(sourceFile, targetFile);
    }
  });
};

const createFile = (target: string, content: string): void => {
  const targetExists = fs.existsSync(target);
  if (!targetExists) {
    fs.writeFileSync(target, content);
  }
};

const injectToFile = (
  target: string,
  content: string,
  {
    insert_before = '',
    insert_after = '',
  }: { insert_before?: string; insert_after?: string } = {}
): void => {
  fs.readFile(target, (err, data) => {
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
    fs.writeFileSync(target, newContent);
  });
};

const renameFile = (source: string, target: string): void => {
  const sourcePath = path.join(TEMPLATE_PATH, source);
  const targetPath = path.join(TEMPLATE_PATH, target);
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
