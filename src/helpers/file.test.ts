import path = require('path');

import * as fs from 'fs-extra';
import { readFileSync } from 'fs-extra';

import {
  appendToFile,
  copy,
  createFile,
  getSourcePath,
  getTargetDir,
  getTargetPath,
  injectToFile,
  remove,
  renameFile,
  TEMPLATE_PATH,
} from './file';

jest.mock('fs-extra');

describe('File helpers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTargetDir', () => {
    describe('given projectName', () => {
      it('returns the correct target directory', () => {
        const projectName = 'projectName';

        const targetDir = getTargetDir(projectName);

        expect(targetDir).toBe(path.join(process.cwd(), projectName));
      });
    });
  });

  describe('getTargetPath', () => {
    describe('given file name and projectName', () => {
      it('returns the correct target path', () => {
        const file = 'file';
        const projectName = 'projectName';

        const targetPath = getTargetPath(file, projectName);

        expect(targetPath).toBe(path.join(process.cwd(), projectName, file));
      });
    });
  });

  describe('getSourcePath', () => {
    describe('given file name', () => {
      it('returns the correct source path', () => {
        const file = 'file';

        const sourcePath = getSourcePath(file);

        expect(sourcePath).toBe(path.join(TEMPLATE_PATH, file));
      });
    });
  });

  describe('copy', () => {
    describe('given source and target', () => {
      it('copies the source directory to the target directory', () => {
        const source = 'sourceDir';
        const target = 'targetDir';
        const projectName = 'projectName';
        const sourcePath = getSourcePath(source);
        const targetPath = getTargetPath(target, projectName);

        const copySpy = jest.spyOn(fs, 'copySync');

        copy(source, target, projectName);

        expect(copySpy).toHaveBeenCalledWith(sourcePath, targetPath);
      });
    });
  });

  describe('createFile', () => {
    describe('given target file and content', () => {
      it('creates the target file', () => {
        const target = 'targetFile.txt';
        const content = 'creating content';
        const projectName = 'projectName';
        const targetPath = getTargetPath(target, projectName);

        const createSpy = jest.spyOn(fs, 'writeFileSync');

        createFile(target, content, projectName);

        expect(createSpy).toHaveBeenCalledWith(targetPath, content);
      });
    });
  });

  describe('remove', () => {
    describe('given target file', () => {
      it('removes the target file', () => {
        const target = 'targetFile.txt';
        const projectName = 'projectName';
        const targetPath = getTargetPath(target, projectName);

        const removeSpy = jest.spyOn(fs, 'removeSync');

        remove(target, projectName);

        expect(removeSpy).toHaveBeenCalledWith(targetPath);
      });
    });

    describe('given target directory', () => {
      it('removes the target directory', () => {
        const target = 'targetDir';
        const projectName = 'projectName';
        const targetPath = getTargetPath(target, projectName);

        const removeSpy = jest.spyOn(fs, 'removeSync');

        remove(target, projectName);

        expect(removeSpy).toHaveBeenCalledWith(targetPath);
      });
    });
  });

  describe('renameFile', () => {
    describe('given source and target', () => {
      it('renames the source file to the target file', () => {
        const source = 'sourceFile.txt';
        const target = 'targetFile.txt';
        const projectName = 'projectName';
        const sourcePath = getTargetPath(source, projectName);
        const targetPath = getTargetPath(target, projectName);

        const renameSpy = jest.spyOn(fs, 'renameSync');

        renameFile(source, target, projectName);

        expect(renameSpy).toHaveBeenCalledWith(sourcePath, targetPath);
      });
    });
  });

  describe('appendToFile', () => {
    describe('given target file and content', () => {
      it('appends content to the target file', () => {
        const target = 'targetFile.txt';
        const content = 'appending content';
        const projectName = 'projectName';
        const targetPath = getTargetDir(projectName);

        const appendSpy = jest.spyOn(fs, 'appendFileSync');

        appendToFile(target, content, projectName);

        expect(appendSpy).toHaveBeenCalledWith(
          path.join(targetPath, target),
          content,
        );
      });
    });
  });

  describe('injectToFile', () => {
    describe('given target file, content and insert before initial content', () => {
      it('injects content to the target file', () => {
        const target = 'targetFile.txt';
        const initialContent = 'initial content';
        const content = 'injecting content';
        const projectName = 'projectName';
        const targetPath = getTargetDir(projectName);

        const injectSpy = jest.spyOn(fs, 'writeFileSync');

        (readFileSync as jest.Mock).mockReturnValue(initialContent);

        injectToFile(target, content, projectName, { insertBefore: initialContent });

        expect(injectSpy).toHaveBeenCalledWith(
          path.join(targetPath, target),
          `${content}\n${initialContent}`,
        );
      });
    });

    describe('given target file, content and insert after initial content', () => {
      it('injects content to the target file', () => {
        const target = 'targetFile.txt';
        const initialContent = 'initial content';
        const content = 'injecting content';
        const projectName = 'projectName';
        const targetPath = getTargetDir(projectName);

        const injectSpy = jest.spyOn(fs, 'writeFileSync');

        (readFileSync as jest.Mock).mockReturnValue(initialContent);

        injectToFile(target, content, projectName, { insertAfter: initialContent });

        expect(injectSpy).toHaveBeenCalledWith(
          path.join(targetPath, target),
          `${initialContent}\n${content}`,
        );
      });
    });
  });
});
