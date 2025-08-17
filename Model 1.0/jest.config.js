module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }],
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/index.ts',
    '!src/utils/index.ts',
    '!src/utils/constants.ts',
    '!src/utils/logger.ts',
    '!src/utils/test-setup.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  setupFilesAfterEnv: ['<rootDir>/src/utils/test-setup.ts'],
  testTimeout: 30000,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/src/**/*.test.ts'],
      testPathIgnorePatterns: ['<rootDir>/src/__tests__/integration/'],
      setupFilesAfterEnv: ['<rootDir>/src/utils/test-setup.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
      transform: {
        '^.+\.ts$': ['ts-jest', {
          tsconfig: 'tsconfig.test.json'
        }],
      }
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/src/__tests__/integration/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/src/utils/test-setup.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
      transform: {
        '^.+\.ts$': ['ts-jest', {
          tsconfig: 'tsconfig.test.json'
        }],
      }
    }
  ]
};