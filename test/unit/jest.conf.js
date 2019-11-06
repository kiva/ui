const path = require('path');

module.exports = {
	rootDir: path.resolve(__dirname, '../../'),
	testMatch: ['**/unit/specs/**/*.spec.js'],
	moduleFileExtensions: ['js', 'json', 'vue'],
	moduleNameMapper: {
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
		'!**/node_modules/**',
		'!src/plugins/index.js',
		'!src/assets/',
		'!src/router/',
		'!src/head/'
	],
	testURL: 'http://localhost'
};
