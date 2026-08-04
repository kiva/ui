import { createApp } from 'vue';
import useMultiMatching, { preFetchOperations } from '#src/composables/useMultiMatching';

vi.mock('#src/graphql/query/multiMatchingEnabled.graphql', () => ({
	default: { kind: 'Document', definitions: [{ name: { value: 'MultiMatchingEnabled' } }] },
}));

function enabledData(value) {
	return {
		general: {
			multiMatchingEnabled: { key: 'create_multi_match_reservations.enabled', value },
		},
	};
}

describe('useMultiMatching', () => {
	let mockApollo;
	let emit;

	const mountComposable = (apolloClient = mockApollo) => {
		let result;
		const TestComponent = {
			name: 'TestComponent',
			// The transform attaches the composable's operations to every real
			// component that imports it
			preFetchOperations,
			setup() {
				result = useMultiMatching();
				return {};
			},
			template: '<div></div>',
		};
		const app = createApp(TestComponent);
		if (apolloClient) {
			app.provide('apollo', apolloClient);
		}
		app.mount(document.createElement('div'));
		return result;
	};

	beforeEach(() => {
		emit = null;
		mockApollo = {
			readQuery: vi.fn(() => null),
			watchQuery: vi.fn(() => ({
				subscribe: observer => {
					emit = observer;
					return { unsubscribe: vi.fn() };
				},
			})),
		};
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('reports unresolved and disabled before the setting arrives', () => {
		const { enableMultiMatching, multiMatchingResolved } = mountComposable();
		expect(enableMultiMatching.value).toBe(false);
		expect(multiMatchingResolved.value).toBe(false);
	});

	it('enables multi matching when the setting arrives enabled', () => {
		const { enableMultiMatching, multiMatchingResolved } = mountComposable();
		emit.next({ data: enabledData('true') });
		expect(enableMultiMatching.value).toBe(true);
		expect(multiMatchingResolved.value).toBe(true);
	});

	it('stays disabled but resolved when the setting arrives disabled', () => {
		const { enableMultiMatching, multiMatchingResolved } = mountComposable();
		emit.next({ data: enabledData('false') });
		expect(enableMultiMatching.value).toBe(false);
		expect(multiMatchingResolved.value).toBe(true);
	});

	it('resolves synchronously from a prefetched cache value', () => {
		mockApollo.readQuery = vi.fn(() => enabledData('true'));
		const { enableMultiMatching, multiMatchingResolved } = mountComposable();
		expect(enableMultiMatching.value).toBe(true);
		expect(multiMatchingResolved.value).toBe(true);
	});

	it('resolves to the disabled default when the fetch fails', () => {
		const { enableMultiMatching, multiMatchingResolved } = mountComposable();
		emit.error(new Error('Network error'));
		expect(enableMultiMatching.value).toBe(false);
		expect(multiMatchingResolved.value).toBe(true);
	});

	it('registers its operation for prefetching', () => {
		expect(preFetchOperations).toHaveLength(1);
		expect(preFetchOperations[0].query).toBeDefined();
	});

	it('resolves to the disabled default when graphql errors arrive instead of the setting', () => {
		const { enableMultiMatching, multiMatchingResolved } = mountComposable();
		emit.next({ data: undefined, errors: [{ message: 'failed', code: 'api.error' }] });
		expect(enableMultiMatching.value).toBe(false);
		expect(multiMatchingResolved.value).toBe(true);
	});

	it('stays unresolved and disabled when apollo is not provided', () => {
		const { enableMultiMatching, multiMatchingResolved } = mountComposable(null);
		expect(enableMultiMatching.value).toBe(false);
		expect(multiMatchingResolved.value).toBe(false);
	});
});
