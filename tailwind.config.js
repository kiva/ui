const kvConfig = require('@kiva/kv-components/tailwind.config.js');

module.exports = {
	mode: 'jit',
	presets: [kvConfig],
	purge: {
		content: [
			'./node_modules/@kiva/kv-components/**/*.vue',
			'./node_modules/@kiva/kv-components/utils/**/*.js',
			'./server/**/*.html',
			'./src/**/*.vue',
			'./tailwind.purge.safelist.txt'
		]
	}
};
