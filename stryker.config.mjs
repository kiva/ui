// @ts-check
import { fileURLToPath } from 'url';
import path from 'path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
	$schema: './node_modules/@stryker-mutator/core/schema/stryker-schema.json',
	testRunner: 'vitest',
	mutate: [
		// Working files
		'src/util/numberUtils.js',
		'src/util/comparators.js',
		'src/util/joinArray.js',
		'src/util/injectionCheck.js',
		'src/util/dateUtils.js',
		'src/util/getCacheKey.js',
		'src/util/urlUtils.js',
		'src/util/imageUtils.js',
		'src/util/loanUse.js',
		'src/components/**/*.vue',
		// Skipping: experiment utils - spied on by loanChannelUtils tests
		// Skipping: settingsUtils, loanSearch - complex mocking dependencies
		// Skipping: flssUtils, loanChannelUtils - use vi.spyOn
	],
	reporters: ['progress', 'clear-text', 'html'],
	ignorePatterns: [
		'coverage',
		'test/coverage',
	],
	ignorers: ['vue/SFC', 'import.meta.glob'],
	plugins: ['@stryker-mutator/*', './test/stryker-ignorer.js'],
	vitest: {
		configFile: path.resolve(dirname, 'vite.config.js'),
		dir: './test/unit/specs',
	},
};
export default config;
