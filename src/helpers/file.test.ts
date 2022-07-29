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
      it('appends content to the target file', () => {
        const target = 'targetFile.txt';
        const content = 'appending content';
        const projectName = 'projectName';
        const targetPath = getProjectPath(projectName);

        const appendSpy = jest.spyOn(fs, 'appendFileSync');

        appendToFile(target, content, projectName);

        expect(appendSpy).toHaveBeenCalledWith(
          path.join(targetPath, target),
          content
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
});
