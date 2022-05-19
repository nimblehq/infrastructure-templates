import * as fs from 'fs';
import path = require('path');

const TEMPLATE_DIR = path.join(__dirname, '..', '..', 'skeleton');

const copyFile = (source: string, target: string): void => {
  const sourcePath = path.join(TEMPLATE_DIR, source);

  fs.copyFileSync(sourcePath, target);
};

const copyDir = (source: string, target: string): void => {
  const sourcePath = path.join(TEMPLATE_DIR, source);
  const targetExists = fs.existsSync(target);
  if (!targetExists) {
    fs.mkdirSync(target);
  }

  const files = fs.readdirSync(sourcePath);
  files.forEach((file) => {
    const sourceFile = path.join(source, file);
    const targetFile = path.join(target, file);
    if (fs.lstatSync(path.join(TEMPLATE_DIR, sourceFile)).isDirectory()) {
      copyDir(sourceFile, targetFile);
    } else {
      copyFile(sourceFile, targetFile);
    }
  });
};

export { copyFile, copyDir };
