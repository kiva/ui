import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import GitRevisionPlugin from 'git-revision-webpack-plugin';
import graphQLLoader from 'vite-plugin-graphql-loader';
// import htmlPurge from 'vite-plugin-html-purgecss';
import legacy from '@vitejs/plugin-legacy';
import svgLoader from 'vite-svg-loader';
import svgStore from 'vite-plugin-svg-store';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import tailwindcss from 'tailwindcss';

const isProd = process.env.NODE_ENV === 'production';

// Get git information
const gitRevisionPlugin = new GitRevisionPlugin({
	branch: true,
	lightweightTags: true,
});

// resolve path
const resolve = dir => path.resolve(path.dirname(fileURLToPath(import.meta.url)), dir);

// asset regular expressions
const fontsRegex = /fonts\/.+\.(woff2?|eot|ttf|otf|svg)/;
const imagesRegex = /images\/.+\.(png|jpe?g|gif|webp|avif|svg|ico)/;
const mediaRegex = /media\/.+\.(mp4|webm|ogg|mp3|wav|flac|aac)/;

// https://vitejs.dev/config/
export default defineConfig({
	assetsInclude: [
		'**/*.bin',
		'**/*.wasm',
	],
	build: {
		assetsDir: 'static',
		assetsInlineLimit: (filePath, content) => {
			const size = content.length;
			if (fontsRegex.test(filePath) || mediaRegex.test(filePath)) {
				return size <= 10000;
			}
			if (imagesRegex.test(filePath)) {
				return size <= 1; // could be 10000 but we'd need to exclude apple-touch-icons
			}
			// vite default
			return size <= 4096;
		},
	},
	css: {
		postcss: {
			plugins: isProd ? [
				autoprefixer,
				cssnano,
				tailwindcss,
			] : [
				tailwindcss,
			],
		},
		preprocessorOptions: {
			scss: {
				// Suppress deprecation warnings from node modules
				quietDeps: true,
			},
		},
	},
	define: {
		UI_COMMIT: JSON.stringify(gitRevisionPlugin.commithash()),
		UI_BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
		UI_TAG: JSON.stringify(gitRevisionPlugin.version()),
	},
	plugins: [
		vue({
			template: {
				compilerOptions: {
					compatConfig: {
						MODE: 3,
					},
				},
			},
		}),
		// load .graphql and .gql files
		graphQLLoader(),
		// this is supposed to be equivalent to mini-css-extract-plugin, not sure if that's true
		// htmlPurge(),
		// polyfill for older browsers. requires terser
		legacy(),
		// load svg files as vue components
		svgLoader({
			svgoConfig: {
				plugins: [
					{ name: 'removeTitle', active: false },
				],
			},
		}),
		// svg icon sprite sheet
		svgStore({
			dirs: ['src/assets/icons/sprite'],
			symbolId: 'icon-[name]',
			optimizeOptions: {
				floatPrecision: 3,
			},
		}),
	],
	resolve: {
		alias: {
			// alias src directory
			'#src': resolve('src'),
			// alias node_modules directory
			'#node_modules': resolve('node_modules'),
			// alias promise module to handle timesync calling require('promise')
			promise: resolve('build/promise.js'),
			// required for src/components/Contentful/DynamicRichText.vue
			vue$: 'vue/dist/vue.esm-browser.js',
		},
		extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
	},
});
