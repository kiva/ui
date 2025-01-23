import { tailwindConfig } from '@kiva/kv-tokens';

export default {
	presets: [tailwindConfig],
	content: [
		'./node_modules/@kiva/kv-components/**/*.vue',
		'./node_modules/@kiva/kv-components/utils/**/*.js',
		'./server/**/*.html',
		'./src/**/*.vue',
		'./tailwind.purge.safelist.txt',
	]
};
