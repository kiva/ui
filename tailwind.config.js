import { tailwindConfig } from '@kiva/kv-tokens';

export default {
	presets: [tailwindConfig],
	content: [
		'./node_modules/@kiva/kv-components/dist/**/*.js',
		'./server/**/*.html',
		'./src/**/*.vue',
		'./tailwind.purge.safelist.txt',
		'fake'
	]
};
