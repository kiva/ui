import { createApp } from 'vue';
import useApolloQuery from '#src/composables/useApolloQuery';

const dummyQuery = { kind: 'Document', definitions: [{ name: { value: 'DummyOperation' } }] };

const apps = [];

// Mount a bare host component so the composable runs with real setup context
function runInSetup(provides, run) {
	let out;
	const HostComponent = {
		name: 'HostComponent',
		setup() {
			out = run();
			return () => null;
		},
	};
	const app = createApp(HostComponent);
	Object.entries(provides).forEach(([key, value]) => app.provide(key, value));
	app.mount(document.createElement('div'));
	apps.push(app);
	return { out, app };
}

describe('useApolloQuery (client)', () => {
	afterEach(() => {
		apps.splice(0).forEach(app => app.unmount());
		vi.clearAllMocks();
	});

	it('returns the cached value synchronously when the prefetch already loaded it', () => {
		const cached = { general: { setting: 'value' } };
		const apollo = {
			readQuery: vi.fn(() => cached),
			watchQuery: vi.fn(() => ({ subscribe: () => ({ unsubscribe: vi.fn() }) })),
		};
		const { out } = runInSetup({ apollo }, () => useApolloQuery({ query: dummyQuery }));
		expect(out.result.value).toEqual(cached);
		expect(out.loading.value).toBe(false);
	});

	it('stays loading on a cache miss until the watch query delivers data', () => {
		let emit;
		const apollo = {
			readQuery: vi.fn(() => null),
			watchQuery: vi.fn(() => ({
				subscribe: observer => {
					emit = observer;
					return { unsubscribe: vi.fn() };
				},
			})),
		};
		const { out } = runInSetup({ apollo }, () => useApolloQuery({ query: dummyQuery }));
		expect(out.loading.value).toBe(true);
		expect(out.result.value).toBeNull();

		const data = { general: { setting: 'value' } };
		emit.next({ data });
		expect(out.result.value).toEqual(data);
		expect(out.loading.value).toBe(false);
	});

	it('exposes the graphql errors array delivered alongside results', () => {
		let emit;
		const apollo = {
			readQuery: vi.fn(() => null),
			watchQuery: vi.fn(() => ({
				subscribe: observer => {
					emit = observer;
					return { unsubscribe: vi.fn() };
				},
			})),
		};
		const { out } = runInSetup({ apollo }, () => useApolloQuery({ query: dummyQuery }));

		const graphqlError = { message: 'not found', code: 'api.notFound' };
		emit.next({ data: undefined, errors: [graphqlError] });
		expect(out.error.value).toEqual([graphqlError]);
		expect(out.loading.value).toBe(false);
		expect(out.result.value).toBeNull();
	});

	it('exposes transport errors', () => {
		let emit;
		const apollo = {
			readQuery: vi.fn(() => null),
			watchQuery: vi.fn(() => ({
				subscribe: observer => {
					emit = observer;
					return { unsubscribe: vi.fn() };
				},
			})),
		};
		const { out } = runInSetup({ apollo }, () => useApolloQuery({ query: dummyQuery }));

		const failure = new Error('network');
		emit.error(failure);
		expect(out.error.value).toBe(failure);
		expect(out.loading.value).toBe(false);
	});

	it('honors the operation fetchPolicy in the watch query', () => {
		const apollo = {
			readQuery: vi.fn(() => null),
			watchQuery: vi.fn(() => ({ subscribe: () => ({ unsubscribe: vi.fn() }) })),
		};
		runInSetup({ apollo }, () => useApolloQuery({ query: dummyQuery, fetchPolicy: 'cache-and-network' }));
		expect(apollo.watchQuery).toHaveBeenCalledWith(
			expect.objectContaining({ fetchPolicy: 'cache-and-network' })
		);
	});

	it('omits fetchPolicy from the watch query when the operation sets none', () => {
		const apollo = {
			readQuery: vi.fn(() => null),
			watchQuery: vi.fn(() => ({ subscribe: () => ({ unsubscribe: vi.fn() }) })),
		};
		runInSetup({ apollo }, () => useApolloQuery({ query: dummyQuery }));
		expect(apollo.watchQuery).toHaveBeenCalledWith(
			expect.not.objectContaining({ fetchPolicy: expect.anything() })
		);
	});

	it('unsubscribes when the component unmounts', () => {
		const unsubscribe = vi.fn();
		const apollo = {
			readQuery: vi.fn(() => null),
			watchQuery: vi.fn(() => ({ subscribe: () => ({ unsubscribe }) })),
		};
		const { app } = runInSetup({ apollo }, () => useApolloQuery({ query: dummyQuery }));
		app.unmount();
		expect(unsubscribe).toHaveBeenCalled();
	});

	it('returns inert refs when no apollo client is provided', () => {
		const { out } = runInSetup({}, () => useApolloQuery({ query: dummyQuery }));
		expect(out.result.value).toBeNull();
		expect(out.loading.value).toBe(true);
		expect(out.error.value).toBeNull();
	});

	it('tolerates an apollo mock without readQuery or watchQuery', () => {
		const apollo = { query: vi.fn() };
		const { out } = runInSetup({ apollo }, () => useApolloQuery({ query: dummyQuery }));
		expect(out.result.value).toBeNull();
		expect(out.loading.value).toBe(true);
	});
});
