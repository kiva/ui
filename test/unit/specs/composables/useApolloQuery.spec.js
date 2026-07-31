import { createApp, ref, nextTick } from 'vue';
import useApolloQuery from '#src/composables/useApolloQuery';
import logReadQueryError from '#src/util/logReadQueryError';

vi.mock('#src/util/logReadQueryError', () => ({ default: vi.fn() }));

const dummyQuery = { kind: 'Document', definitions: [{ name: { value: 'DummyOperation' } }] };

const apps = [];

// Mount a bare host component so the composable runs with real setup context.
// hostExtras lands on the host definition, standing in for the operations the
// transform attaches.
function runInSetup(provides, run, { hostExtras = {} } = {}) {
	let out;
	const HostComponent = {
		name: 'HostComponent',
		...hostExtras,
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

	it('returns the cached value synchronously when the operation was prefetched', () => {
		const cached = { general: { setting: 'value' } };
		const apollo = {
			readQuery: vi.fn(() => cached),
			watchQuery: vi.fn(() => ({ subscribe: () => ({ unsubscribe: vi.fn() }) })),
		};
		const operation = { query: dummyQuery };
		const { out } = runInSetup({ apollo }, () => useApolloQuery(operation), {
			hostExtras: { preFetchOperations: [operation] },
		});
		expect(apollo.readQuery).toHaveBeenCalled();
		expect(out.result.value).toEqual(cached);
		expect(out.loading.value).toBe(false);
	});

	it('reads the cache with the prefetch variables and watches with the client variables', () => {
		const apollo = {
			readQuery: vi.fn(() => null),
			watchQuery: vi.fn(() => ({ subscribe: () => ({ unsubscribe: vi.fn() }) })),
		};
		const operation = {
			query: dummyQuery,
			preFetchVariables: () => ({ id: 7 }),
		};
		runInSetup({ apollo }, () => useApolloQuery(operation, () => ({ id: 9 })), {
			hostExtras: { preFetchOperations: [operation] },
		});
		expect(apollo.readQuery).toHaveBeenCalledWith({
			query: dummyQuery,
			variables: { id: 7 },
		});
		expect(apollo.watchQuery).toHaveBeenCalledWith(
			expect.objectContaining({ variables: { id: 9 } })
		);
	});

	it('does not read the cache when the operation is not attached', () => {
		const apollo = {
			readQuery: vi.fn(() => null),
			watchQuery: vi.fn(() => ({ subscribe: () => ({ unsubscribe: vi.fn() }) })),
		};
		runInSetup({ apollo }, () => useApolloQuery({ query: dummyQuery }));
		expect(apollo.readQuery).not.toHaveBeenCalled();
		expect(apollo.watchQuery).toHaveBeenCalled();
	});

	it('does not read the cache when a registered operation authors preFetch: false', () => {
		const apollo = {
			readQuery: vi.fn(() => null),
			watchQuery: vi.fn(() => ({ subscribe: () => ({ unsubscribe: vi.fn() }) })),
		};
		const operation = { query: dummyQuery, preFetch: false };
		runInSetup({ apollo }, () => useApolloQuery(operation), {
			hostExtras: { preFetchOperations: [operation] },
		});
		expect(apollo.readQuery).not.toHaveBeenCalled();
		expect(apollo.watchQuery).toHaveBeenCalled();
	});

	it('does not read the cache when shouldPreFetch returns false', () => {
		const apollo = {
			readQuery: vi.fn(() => null),
			watchQuery: vi.fn(() => ({ subscribe: () => ({ unsubscribe: vi.fn() }) })),
		};
		const operation = { query: dummyQuery, shouldPreFetch: () => false };
		runInSetup({ apollo }, () => useApolloQuery(operation), {
			hostExtras: { preFetchOperations: [operation] },
		});
		expect(apollo.readQuery).not.toHaveBeenCalled();
		expect(apollo.watchQuery).toHaveBeenCalled();
	});

	it('reports a failed cache read and continues to the watch query', () => {
		const failure = new Error('cache invariant violation');
		const apollo = {
			readQuery: vi.fn(() => { throw failure; }),
			watchQuery: vi.fn(() => ({ subscribe: () => ({ unsubscribe: vi.fn() }) })),
		};
		const operation = { query: dummyQuery };
		const { out } = runInSetup({ apollo }, () => useApolloQuery(operation), {
			hostExtras: { preFetchOperations: [operation] },
		});
		expect(logReadQueryError).toHaveBeenCalledWith(failure, 'useApolloQuery DummyOperation');
		expect(apollo.watchQuery).toHaveBeenCalled();
		expect(out.result.value).toBeNull();
		expect(out.loading.value).toBe(true);
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
		const operation = { query: dummyQuery };
		const { out } = runInSetup({ apollo }, () => useApolloQuery(operation), {
			hostExtras: { preFetchOperations: [operation] },
		});
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

	it('passes plain object variables to the watch query', () => {
		const apollo = {
			readQuery: vi.fn(() => null),
			watchQuery: vi.fn(() => ({ subscribe: () => ({ unsubscribe: vi.fn() }) })),
		};
		runInSetup({ apollo }, () => useApolloQuery({ query: dummyQuery }, { id: 5 }));
		expect(apollo.watchQuery).toHaveBeenCalledWith(
			expect.objectContaining({ variables: { id: 5 } })
		);
	});

	it('updates the watch query when the reactive variables change', async () => {
		const setVariables = vi.fn();
		const apollo = {
			readQuery: vi.fn(() => null),
			watchQuery: vi.fn(() => ({
				setVariables,
				subscribe: () => ({ unsubscribe: vi.fn() }),
			})),
		};
		const id = ref(1);
		runInSetup({ apollo }, () => useApolloQuery({ query: dummyQuery }, () => ({ id: id.value })));
		expect(apollo.watchQuery).toHaveBeenCalledWith(
			expect.objectContaining({ variables: { id: 1 } })
		);

		id.value = 2;
		await nextTick();
		expect(setVariables).toHaveBeenCalledWith({ id: 2 });
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
});
