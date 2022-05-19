import * as fs from 'fs';
import path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');
const TEMPLATE_DIR =
  process.env.NODE_ENV === 'development' ? 'skeleton' : 'dist/skeleton';
const TEMPLATE_PATH = path.join(ROOT_DIR, TEMPLATE_DIR);

const copyFile = (source: string, target: string): void => {
  const sourcePath = path.join(TEMPLATE_PATH, source);

  fs.copyFileSync(sourcePath, target);
};

const copyDir = (source: string, target: string): void => {
  const sourcePath = path.join(TEMPLATE_PATH, source);
  const targetExists = fs.existsSync(target);
  if (!targetExists) {
    fs.mkdirSync(target);
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

export { copyFile, copyDir };
