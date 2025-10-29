// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
	testRunner: 'vitest',
	reporters: ['progress', 'clear-text', 'html'],
	ignorePatterns: ['coverage', '/src/assets/iconLoader.js', 'src/head', 'src/lib'],
	ignorers: ['vue/SFC', 'import.meta.glob'],
	plugins: ['@stryker-mutator/*', './test/stryker-ignorer.js'],
	vitest: {
		configFile: 'vite.config.js',
	},
};
export default config;
