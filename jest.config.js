"use strict";
var reporters = ['default'];
module.exports = {
    moduleFileExtensions: ['js', 'ts'],
    modulePaths: [
        'test',
    ],
    modulePathIgnorePatterns: ['dist'],
    preset: 'ts-jest',
    reporters: reporters,
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        url: 'http://localhost/',
    },
    testMatch: ['**/test/*.test.ts'],
    transform: {
        '^.+\\.[jt]s$': 'ts-jest',
        '\\.(pug)$': 'jest-transform-pug',
        '.+\\.(css)$': 'jest-transform-stub',
        '^.+\\.svg$': 'jest-transform-stub',
        '^.+\\.csv$': './jest-transform-csv.js',
    },
};
//# sourceMappingURL=jest.config.js.map