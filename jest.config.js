/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  verbose: true,
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  }
};
