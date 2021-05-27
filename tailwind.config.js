const kvConfig = require('@kiva/kv-components/tailwind.config.js');

module.exports = {
	presets: [kvConfig],
	purge: [
		'./node_modules/@kiva/kv-components/**/*.vue',
		'./server/**/*.html',
		'./src/**/*.vue',
	],
};
