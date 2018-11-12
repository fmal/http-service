'use strict';

const isCI = Boolean(process.env.CI);

// eslint-disable-next-line import/no-commonjs
module.exports = {
  roots: ['<rootDir>/src'],
  cacheDirectory: '<rootDir>/.jest-cache',
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverage: isCI,
  coverageReporters: ['text', isCI && 'lcov'].filter(Boolean),
  bail: isCI
};
