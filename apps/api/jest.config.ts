import type { Config } from 'jest';

const config = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(@t3-oss/env-core|.*\\.mjs$))'],
  extensionsToTreatAsEsm: ['.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: [
    '<rootDir>/test/__fixtures__',
    '<rootDir>/node_modules',
    '<rootDir>/dist',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  testPathIgnorePatterns: ['<rootDir>/src/__tests__/setup.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
} as const satisfies Config;

export default config;
