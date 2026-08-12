// @vitest-environment node
import path from 'path';
import { fileURLToPath } from 'url';
import { build, createServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import getDeepComponents from '#src/util/getDeepComponents';
import prefetchDiscoveryPlugin from '../../../../build/prefetch-discovery-plugin';

const FIXTURES = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../../fixtures/prefetchDiscovery');

const config = {
	root: FIXTURES,
	configFile: false,
	logLevel: 'error',
	plugins: [vue(), prefetchDiscoveryPlugin()],
	// Import specifiers omit the extension, as the repo lint rules require
	resolve: { extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'] },
};

// A <script setup> component carries its name as __name rather than name
// eslint-disable-next-line no-underscore-dangle
const discoveredNames = definitions => definitions.map(d => d.name ?? d.__name).sort();

const preFetchOperations = definitions => definitions
	.flatMap(d => d.apollo ?? [])
	.filter(operation => operation.preFetch)
	.map(operation => operation.query)
	.sort();

let server;

beforeAll(async () => {
	server = await createServer({ ...config, server: { middlewareMode: true, hmr: false } });
}, 60000);

afterAll(async () => {
	await server.close();
});

describe('prefetch discovery against compiled components', () => {
	it('reaches the children of a <script setup> component', async () => {
		const module = await server.ssrLoadModule('/ScriptSetupParent.vue');
		const discovered = await getDeepComponents([module.default]);
		expect(discoveredNames(discovered)).toEqual(['DynamicChild', 'ScriptSetupParent', 'StaticChild']);
	}, 60000);

	it('makes the queries below a <script setup> component visible to prefetching', async () => {
		const module = await server.ssrLoadModule('/ScriptSetupParent.vue');
		const discovered = await getDeepComponents([module.default]);
		expect(preFetchOperations(discovered)).toEqual(['dynamicChildQuery', 'staticChildQuery']);
	}, 60000);

	it('reaches the children of a lang="ts" setup component', async () => {
		const module = await server.ssrLoadModule('/TypedSetupParent.vue');
		const discovered = await getDeepComponents([module.default]);
		expect(discoveredNames(discovered)).toEqual(['StaticChild', 'TypedSetupParent']);
	}, 60000);

	it('does not reach the children of a component that is not <script setup>', async () => {
		const module = await server.ssrLoadModule('/OptionsApiDispatcher.vue');
		const discovered = await getDeepComponents([module.default]);
		expect(discoveredNames(discovered)).toEqual(['OptionsApiDispatcher']);
		expect(preFetchOperations(discovered)).toEqual([]);
	}, 60000);

	it('survives a production build of a lang="ts" setup component, which splits the script block', async () => {
		const result = await build({
			...config,
			build: {
				write: false,
				minify: false,
				ssr: true,
				rollupOptions: { input: path.join(FIXTURES, 'TypedSetupParent.vue') },
			},
		});
		const outputs = Array.isArray(result) ? result : [result];
		const code = outputs.flatMap(o => o.output).map(chunk => chunk.code ?? '').join('\n');
		expect(code).toContain('__childComponents');
		expect(code).toContain('StaticChild');
	}, 120000);
});
