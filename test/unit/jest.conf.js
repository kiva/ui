const path = require('path');

module.exports = {
	rootDir: path.resolve(__dirname, '../../'),
	testMatch: ['**/unit/specs/**/*.spec.js'],
	moduleFileExtensions: ['js', 'json', 'vue'],
	moduleNameMapper: {
		'^~/(.*)$': '<rootDir>/node_modules/$1',
		'^@/(.*)$': '<rootDir>/src/$1',
		foundation: '<rootDir>/build/no-op.js',
	},
	transform: {
		'^.+\\.(gql|graphql)$': 'jest-transform-graphql',
		'^.+\\.vue$': 'vue-jest',
		'^.+\\.js$': 'babel-jest',
	},
	snapshotSerializers: ['jest-serializer-vue'],
	coverageDirectory: '<rootDir>/test/unit/coverage',
	coverageReporters: ['lcov', 'text-summary'],
	collectCoverageFrom: [
		'src/**/*.{js,vue}',
		'!**/node_modules/**'
	],
	coveragePathIgnorePatterns: [
		'.eslintrc.js',
		'<rootDir>/build/',
		'<rootDir>/src/assets/',
		'<rootDir>/src/components',
		'<rootDir>/src/head/',
		'<rootDir>/src/pages/',
		'<rootDir>/src/plugins/index.js',
		'<rootDir>/src/router/',
		'<rootDir>/node_modules/'
	],
	testURL: 'http://localhost'
};
