declare global {
  namespace jest {
    interface Matchers<R> {
      toBeEmpty: () => R;
      toHaveFile: (expectedFile: string) => R;
      toHaveFiles: (expectedFiles: string[]) => R;
      toHaveDirectory: (expectedDirectory: string) => R;
      toHaveDirectories: (expectedDirectories: string[]) => R;
      toHaveContentInFile: (
        expectedFile: string,
        expectedContent: string | string[],
        options?: { ignoreSpaces?: boolean }
      ) => R;
    }
  }
}

export {};
