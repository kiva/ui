const path = require('path');

module.exports = {
	rootDir: path.resolve(__dirname, '../../'),
	testMatch: [
		'**/unit/specs/**/*.spec.js',
		// TODO: this suite fails in cjs jest becuase server/util/config uses module-level await
		'!**/unit/specs/server/live-loan-fetch.spec.js',
	],
	moduleFileExtensions: ['js', 'cjs', 'mjs', 'json', 'vue'],
	moduleNameMapper: {
		'^~/(.*)$': '<rootDir>/node_modules/$1',
		'^@/(.*)$': '<rootDir>/src/$1',
		'^/src/(.*)$': '<rootDir>/src/$1',
		'^#src/(.*)?url$': '<rootDir>/test/unit/transforms/svgTransform.cjs',
		'^#src/(.*)$': '<rootDir>/src/$1',
		'^#kv-components/(.*)$': '<rootDir>/node_modules/@kiva/kv-components/dist/vue/$1',
		'\\.css$': '<rootDir>/build/no-op.js',
		foundation: '<rootDir>/build/no-op.js',
	},
	transform: {
		'\\.(gql|graphql)$': '@graphql-tools/jest-transform',
		'^.+\\.vue$': '@vue/vue3-jest',
		'^.+\\.js$': 'babel-jest',
		'^.+\\.svg$': '<rootDir>/test/unit/transforms/svgTransform.cjs',
	},
	transformIgnorePatterns: ['/node_modules/(?!@kiva/)'],
	snapshotSerializers: ['jest-serializer-vue'],
	coverageDirectory: '<rootDir>/test/unit/coverage',
	coverageReporters: ['json', 'html'],
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
		'<rootDir>/src/lib/',
		'<rootDir>/src/pages/',
		'<rootDir>/src/plugins/index.js',
		'<rootDir>/src/router/',
		'<rootDir>/src/util/animation',
		'<rootDir>/node_modules/'
	],
	testEnvironment: 'jsdom',
	testEnvironmentOptions: {
		url: 'http://localhost',
		customExportConditions: ['node', 'node-addons'],
	},
};
