const kvConfig = require('@kiva/kv-components/tailwind.config.cjs');

module.exports = {
	prefix: 'tw-',
	presets: [kvConfig],
	content: [
		'./node_modules/@kiva/kv-components/**/*.vue',
		'./node_modules/@kiva/kv-components/utils/**/*.js',
		'./server/**/*.html',
		'./src/**/*.vue',
		'./tailwind.purge.safelist.txt',
	]
};
