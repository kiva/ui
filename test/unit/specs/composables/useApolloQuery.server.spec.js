// @vitest-environment node
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { routeLocationKey } from 'vue-router';
import useApolloQuery from '#src/composables/useApolloQuery';

const dummyQuery = { kind: 'Document', definitions: [{ name: { value: 'DummyOperation' } }] };

// Render a bare host app so the composable runs during a real server render.
// hostExtras lands on the host definition, standing in for the operations the
// transform attaches.
async function renderWithComposable(apollo, run, { provides = {}, hostExtras = {} } = {}) {
	let out;
	const HostComponent = {
		name: 'HostComponent',
		...hostExtras,
		setup() {
			out = run();
			return () => null;
		},
	};
	const app = createSSRApp(HostComponent);
	app.provide('apollo', apollo);
	// Reflect.ownKeys keeps symbol keys like routeLocationKey, which Object.entries drops
	Reflect.ownKeys(provides).forEach(key => app.provide(key, provides[key]));
	await renderToString(app);
	return out;
}

describe('useApolloQuery (server)', () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

	it('uses the prefetched cache value without fetching or warning', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const cached = { general: { setting: 'value' } };
		const apollo = {
			readQuery: vi.fn(() => cached),
			query: vi.fn(),
		};
		const out = await renderWithComposable(apollo, () => useApolloQuery({ query: dummyQuery }));
		expect(apollo.query).not.toHaveBeenCalled();
		expect(out.result.value).toEqual(cached);
		expect(out.loading.value).toBe(false);
		expect(warn).not.toHaveBeenCalled();
	});

	it('does not fetch on a cache miss and warns about the unattached operation', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const apollo = {
			readQuery: vi.fn(() => null),
			query: vi.fn(),
		};
		const out = await renderWithComposable(apollo, () => useApolloQuery({ query: dummyQuery }));
		expect(apollo.query).not.toHaveBeenCalled();
		expect(out.result.value).toBeNull();
		expect(out.loading.value).toBe(true);
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('SSR cache miss for DummyOperation in HostComponent')
		);
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('not attached to the component')
		);
	});

	it('warns about a failed cache read when the operation is attached', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const apollo = {
			readQuery: vi.fn(() => null),
			query: vi.fn(),
		};
		const operation = { query: dummyQuery };
		await renderWithComposable(apollo, () => useApolloQuery(operation), {
			hostExtras: { preFetchOperations: [operation] },
		});
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('the prefetch ran but the cache read missed')
		);
	});

	it('does not warn when the operation opted out of prefetching', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const apollo = {
			readQuery: vi.fn(() => null),
			query: vi.fn(),
		};
		const out = await renderWithComposable(apollo, () => useApolloQuery({
			query: dummyQuery,
			shouldPreFetch: () => false,
		}));
		expect(apollo.query).not.toHaveBeenCalled();
		expect(out.loading.value).toBe(true);
		expect(warn).not.toHaveBeenCalled();
	});

	it('evaluates shouldPreFetch with the same context the prefetcher passes', async () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		const apollo = {
			readQuery: vi.fn(() => null),
			query: vi.fn(),
		};
		const shouldPreFetch = vi.fn(() => false);
		const cookieStore = { get: () => null };
		const device = { isMobile: false };
		const kvAuth0 = { user: null };
		const renderConfig = {};
		const route = { path: '/spec', query: {}, matched: [{ path: '/spec' }] };
		const operation = { query: dummyQuery, shouldPreFetch };
		await renderWithComposable(apollo, () => useApolloQuery(operation), {
			provides: {
				cookieStore,
				device,
				kvAuth0,
				$renderConfig: renderConfig,
				[routeLocationKey]: route,
			},
		});
		expect(shouldPreFetch).toHaveBeenCalledWith(operation, {
			cookieStore,
			device,
			kvAuth0,
			renderConfig,
			route,
		});
	});
});
