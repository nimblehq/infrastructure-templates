import * as legacyFs from 'fs';
import path = require('path');

import * as fs from 'fs-extra';
import { readFileSync } from 'fs-extra';

import {
  appendToFile,
  copy,
  createFile,
  getTemplateFilePath,
  getProjectPath,
  getProjectFilePath,
  getTemplatePath,
  injectToFile,
  remove,
  rename,
  isExisting,
  containsContent,
} from './file';

jest.mock('fs-extra');

describe('File helpers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProjectPath', () => {
    describe('given projectName', () => {
      it('returns the correct target directory', () => {
        const projectName = 'projectName';

        const targetDir = getProjectPath(projectName);

        expect(targetDir).toBe(path.join(process.cwd(), projectName));
      });
    });
  });

  describe('getProjectFilePath', () => {
    describe('given file name and projectName', () => {
      it('returns the correct target path', () => {
        const file = 'file';
        const projectName = 'projectName';

        const targetPath = getProjectFilePath(file, projectName);

        expect(targetPath).toBe(path.join(process.cwd(), projectName, file));
      });
    });
  });

  describe('getTemplatePath', () => {
    describe('given NODE_ENV is production', () => {
      const OLD_ENV = process.env;

      beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
        process.env.NODE_ENV = 'production';
      });

      afterAll(() => {
        process.env = OLD_ENV;
      });

      it('returns the correct source path', () => {
        const sourcePath = getTemplatePath();

        expect(sourcePath).toContain('/dist/skeleton');
      });
    });

    describe('given NODE_ENV is not production', () => {
      const OLD_ENV = process.env;

      beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
        process.env.NODE_ENV = 'development';
      });

      afterAll(() => {
        process.env = OLD_ENV;
      });

      it('returns the correct source path', () => {
        const sourcePath = getTemplatePath();

        expect(sourcePath).toContain('/skeleton');
      });
    });
  });

  describe('getTemplateFilePath', () => {
    describe('given file name', () => {
      it('returns the correct source path', () => {
        const file = 'example.txt';

        const sourcePath = getTemplateFilePath(file);

        expect(sourcePath).toBe(path.join(getTemplatePath(), file));
      });
    });
  });

  describe('copy', () => {
    describe('given source and target', () => {
      it('copies the source directory to the target directory', () => {
        const source = 'sourceDir';
        const target = 'targetDir';
        const projectName = 'projectName';
        const sourcePath = getTemplateFilePath(source);
        const targetPath = getProjectFilePath(target, projectName);

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
        const targetPath = getProjectFilePath(target, projectName);

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
        const targetPath = getProjectFilePath(target, projectName);

        const removeSpy = jest.spyOn(fs, 'removeSync');

        remove(target, projectName);

        expect(removeSpy).toHaveBeenCalledWith(targetPath);
      });
    });

    describe('given target directory', () => {
      it('removes the target directory', () => {
        const target = 'targetDir';
        const projectName = 'projectName';
        const targetPath = getProjectFilePath(target, projectName);

        const removeSpy = jest.spyOn(fs, 'removeSync');

        remove(target, projectName);

        expect(removeSpy).toHaveBeenCalledWith(targetPath);
      });
    });
  });

  describe('appendToFile', () => {
    describe('given target file and content', () => {
      it('appends content to the target file with trailing newlines', () => {
        const target = 'targetFile.txt';
        const content = 'appending content';
        const projectName = 'projectName';
        const targetPath = getProjectPath(projectName);

        const appendSpy = jest.spyOn(fs, 'appendFileSync');

        appendToFile(target, content, projectName);

        expect(appendSpy).toHaveBeenCalledWith(
          path.join(targetPath, target),
          `\n${content}\n`
        );
      });
    });
  });

  describe('injectToFile', () => {
    describe('given a non-empty project name', () => {
      describe('given target file, content and insert before initial content', () => {
        it('injects content to the target file', () => {
          const target = 'targetFile.txt';
          const initialContent = 'initial content';
          const content = 'injecting content';
          const projectName = 'projectName';
          const targetPath = getProjectPath(projectName);

          const injectSpy = jest.spyOn(fs, 'writeFileSync');

          (readFileSync as jest.Mock).mockReturnValue(initialContent);

          injectToFile(target, content, projectName, {
            insertBefore: initialContent,
          });

          expect(injectSpy).toHaveBeenCalledWith(
            path.join(targetPath, target),
            `${content}\n${initialContent}`
          );
        });
      });

      describe('given target file, content and insert after initial content', () => {
        it('injects content to the target file', () => {
          const target = 'targetFile.txt';
          const initialContent = 'initial content';
          const content = 'injecting content';
          const projectName = 'projectName';
          const targetPath = getProjectPath(projectName);

          const injectSpy = jest.spyOn(fs, 'writeFileSync');

          (readFileSync as jest.Mock).mockReturnValue(initialContent);

          injectToFile(target, content, projectName, {
            insertAfter: initialContent,
          });

          expect(injectSpy).toHaveBeenCalledWith(
            path.join(targetPath, target),
            `${initialContent}\n${content}`
          );
        });
      });

      describe('given no InjectToFile options', () => {
        it('does NOT inject content to the target file', () => {
          const target = 'targetFile.txt';
          const initialContent = 'initial content';
          const content = 'injecting content';
          const projectName = 'projectName';
          const targetPath = getProjectPath(projectName);

          const injectSpy = jest.spyOn(fs, 'writeFileSync');

          (readFileSync as jest.Mock).mockReturnValue(initialContent);

          injectToFile(target, content, projectName);

          expect(injectSpy).toHaveBeenCalledWith(
            path.join(targetPath, target),
            initialContent
          );
        });
      });
    });

    describe('given an empty project name', () => {
      describe('given target file, content and insert before initial content', () => {
        it('injects content to the target file', () => {
          const target = 'targetFile.txt';
          const initialContent = 'initial content';
          const content = 'injecting content';
          const projectName = '';

          const injectSpy = jest.spyOn(fs, 'writeFileSync');

          (readFileSync as jest.Mock).mockReturnValue(initialContent);

          injectToFile(target, content, projectName, {
            insertBefore: initialContent,
          });

          expect(injectSpy).toHaveBeenCalledWith(
            'targetFile.txt',
            `${content}\n${initialContent}`
          );
        });
      });

      describe('given target file, content and insert after initial content', () => {
        it('injects content to the target file', () => {
          const target = 'targetFile.txt';
          const initialContent = 'initial content';
          const content = 'injecting content';
          const projectName = '';

          const injectSpy = jest.spyOn(fs, 'writeFileSync');

          (readFileSync as jest.Mock).mockReturnValue(initialContent);

          injectToFile(target, content, projectName, {
            insertAfter: initialContent,
          });

          expect(injectSpy).toHaveBeenCalledWith(
            'targetFile.txt',
            `${initialContent}\n${content}`
          );
        });
      });
    });
  });

  describe('rename', () => {
    describe('given target file and new name', () => {
      it('renames the target file', () => {
        const target = 'targetFile.txt';
        const newName = 'newName.txt';
        const projectName = 'projectName';
        const targetPath = getProjectFilePath(target, projectName);
        const newPath = getProjectFilePath(newName, projectName);
        const renameSpy = jest.spyOn(legacyFs, 'renameSync');

        (legacyFs.renameSync as jest.Mock).mockReturnValue({});

        rename(target, newName, projectName);

        expect(renameSpy).toHaveBeenCalledWith(targetPath, newPath);
      });
    });
  });

  describe('isExisting', () => {
    describe('given target file', () => {
      it('returns true if the target file exists', () => {
        const target = 'targetFile.txt';
        const projectName = 'projectName';
        const targetPath = getProjectFilePath(target, projectName);
        const existSpy = jest.spyOn(fs, 'existsSync');

        (fs.existsSync as jest.Mock).mockReturnValue(true);

        expect(isExisting(target, projectName)).toBe(true);
        expect(existSpy).toHaveBeenCalledWith(targetPath);
      });

      it('returns false if the target file does not exist', () => {
        const target = 'targetFile.txt';
        const projectName = 'projectName';
        const targetPath = getProjectFilePath(target, projectName);
        const existSpy = jest.spyOn(fs, 'existsSync');

        (fs.existsSync as jest.Mock).mockReturnValue(false);

        expect(isExisting(target, projectName)).toBe(false);
        expect(existSpy).toHaveBeenCalledWith(targetPath);
      });
    });
  });

  describe('containsContent', () => {
    describe('given target file and content', () => {
      it('returns true if the target file contains the content', () => {
        const target = 'targetFile.txt';
        const content = 'content';
        const projectName = 'projectName';
        const targetPath = getProjectFilePath(target, projectName);
        const readSpy = jest.spyOn(fs, 'readFileSync');

        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue([content]);

        expect(containsContent(target, content, projectName)).toBe(true);
        expect(readSpy).toHaveBeenCalledWith(targetPath, 'utf8');
      });

      it('returns false if the target file does not contain the content', () => {
        const target = 'targetFile.txt';
        const content = 'content';
        const projectName = 'projectName';
        const targetPath = getProjectFilePath(target, projectName);
        const readSpy = jest.spyOn(fs, 'readFileSync');

        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue(['']);

        expect(containsContent(target, content, projectName)).toBe(false);
        expect(readSpy).toHaveBeenCalledWith(targetPath, 'utf8');
      });
    });

    describe('given a non-existing target file', () => {
      it('returns false', () => {
        const target = 'targetFile.txt';
        const content = 'content';
        const projectName = 'projectName';
        const readSpy = jest.spyOn(fs, 'readFileSync');

        (fs.existsSync as jest.Mock).mockReturnValue(false);

        expect(containsContent(target, content, projectName)).toBe(false);
        expect(readSpy).not.toHaveBeenCalled();
      });
    });
  });
});
