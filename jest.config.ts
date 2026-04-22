import type { Config } from 'jest';
const config: Config = {
  projects: [
    '<rootDir>/packages/core',
    '<rootDir>/packages/api',
    '<rootDir>/packages/edge-transform',
    '<rootDir>/packages/email-worker',
  ],
};
export default config;
