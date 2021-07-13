const kvConfig = require('@kiva/kv-components/tailwind.config.js');

module.exports = {
	mode: 'jit',
	presets: [kvConfig],
	purge: [
		'./node_modules/@kiva/kv-components/**/*.vue',
		'./node_modules/@kiva/kv-components/utils/**/*.js',
		'./server/**/*.html',
		'./src/**/*.vue',
	],
};
