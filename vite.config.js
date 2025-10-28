import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { coverageConfigDefaults } from 'vitest/config'
import vue from '@vitejs/plugin-vue';
import { GitRevisionPlugin } from 'git-revision-webpack-plugin';
import graphQLLoader from 'vite-plugin-graphql-loader';
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
export default defineConfig(({ isSsrBuild, mode }) => {
	return {
		assetsInclude: [
			'**/*.bin',
			'**/*.wasm',
		],
		// Force all assets/vite calls through /static in dev mode, compiled mode is covered by the build config below
		base: isProd ? '/' : '/static/',
		// Use /static for all assets in prod mode
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
			sourcemap: !isProd,
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
					loadPaths: [
						resolve('node_modules'),
					],
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
				// alias server directory
				'#server': resolve('server'),
				// alias kv-component directory
				'#kv-components': resolve('node_modules/@kiva/kv-components/dist/vue'),
				// alias promise module to handle timesync calling require('promise')
				promise: resolve('src/util/promise/promise.js'),
				// this alias is required for the rendering of src/components/Contentful/DynamicRichText.vue
				// it should only be used on the client build in production
				// eslint-disable-next-line max-len
				...(isSsrBuild === false && mode === 'production' && { vue: path.resolve(__dirname, 'node_modules', 'vue', 'dist', 'vue.esm-bundler.js') })
			},
			extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
		},
		optimizeDeps: {
			include: [
				'vue',
			],
		},
		ssr: {
			noExternal: [
				'@kiva/kv-components',
				'@kiva/kv-shop',
			],
		},
		test: {
			globals: true,
			environment: 'happy-dom',
			setupFiles: ['./test/unit/setup.js'],
			coverage: {
				provider: 'v8',
				reporters: ['json', 'html'],
				reportsDirectory: './test/unit/coverage',
				include: [
					'src/**',
				],
				exclude: [
					'./src/assets/',
					'./src/components',
					'./src/head/',
					'./src/lib/',
					'./src/pages/',
					'./src/plugins/index.js',
					'./src/router/',
					'./src/util/animation',
					'./src/util/siteThemes.js',
					...coverageConfigDefaults.exclude,
				]
			}
		},
	};
});
