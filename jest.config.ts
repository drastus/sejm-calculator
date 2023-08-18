const reporters = ['default'];

module.exports = {
	moduleFileExtensions: ['js', 'ts'],
	modulePaths: [
		'test',
	],
	modulePathIgnorePatterns: ['dist'],
	preset: 'ts-jest',
	reporters,
	testEnvironment: 'jsdom',
	testEnvironmentOptions: {
		url: 'http://localhost/',
	},
	testMatch: ['**/test/*.test.ts'],
	transform: {
		'^.+\\.[jt]s$': 'ts-jest',
		'\\.(pug)$': 'jest-transform-pug',
		'.+\\.(css)$': 'jest-transform-stub',
	},
};
