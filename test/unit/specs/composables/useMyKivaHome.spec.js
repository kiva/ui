import { createApp } from 'vue';
import useMyKivaHome, { preFetchOperations } from '#src/composables/useMyKivaHome';

vi.mock('#src/graphql/query/userId.graphql', () => ({
	default: { kind: 'Document', definitions: [{ name: { value: 'userId' } }] },
}));

// Captures the watch query observer so a test can deliver the client result
function makeApollo(cacheData = null) {
	let observer = null;
	const client = {
		readQuery: () => cacheData,
		watchQuery: () => ({
			subscribe: o => {
				observer = o;
				return { unsubscribe: () => {} };
			},
		}),
	};
	return {
		client,
		emitUser: data => observer.next({ data }),
		emitErrors: errors => observer.next({ data: undefined, errors }),
		emitFailure: e => observer.error(e),
	};
}

function mountComposable(apollo) {
	let paths;
	const TestComponent = {
		name: 'TestComponent',
		// The transform attaches the composable's operations to every real
		// component that imports it
		preFetchOperations,
		setup() {
			paths = useMyKivaHome();
			return {};
		},
		template: '<div></div>',
	};
	const app = createApp(TestComponent);
	if (apollo) {
		app.provide('apollo', apollo);
	}
	app.mount(document.createElement('div'));
	return paths;
}

describe('useMyKivaHome', () => {
	it('returns the homePagePath and portfolioPath computed properties', () => {
		const { client } = makeApollo();
		const { homePagePath, portfolioPath } = mountComposable(client);
		expect(homePagePath).toBeDefined();
		expect(portfolioPath).toBeDefined();
	});

	it('registers its operation for prefetching', () => {
		expect(preFetchOperations).toHaveLength(1);
		expect(preFetchOperations[0].query).toBeDefined();
	});

	it('resolves both paths to my kiva from a prefetched cache value', () => {
		const { client } = makeApollo({ my: { id: 456 } });
		const { homePagePath, portfolioPath } = mountComposable(client);
		expect(homePagePath.value).toBe('/mykiva');
		expect(portfolioPath.value).toBe('/mykiva');
	});

	it('resolves to the logged-out destinations when the prefetched value has no user', () => {
		const { client } = makeApollo({ my: null });
		const { homePagePath, portfolioPath } = mountComposable(client);
		expect(homePagePath.value).toBe('/');
		expect(portfolioPath.value).toBe('/portfolio');
	});

	it('resolves to the logged-out destinations before the user arrives', () => {
		const { client } = makeApollo();
		const { homePagePath, portfolioPath } = mountComposable(client);
		expect(homePagePath.value).toBe('/');
		expect(portfolioPath.value).toBe('/portfolio');
	});

	it('switches both paths to my kiva when the user arrives on the client', () => {
		const { client, emitUser } = makeApollo();
		const { homePagePath, portfolioPath } = mountComposable(client);
		emitUser({ my: { id: 789 } });
		expect(homePagePath.value).toBe('/mykiva');
		expect(portfolioPath.value).toBe('/mykiva');
	});

	it('keeps the logged-out destinations when the user arrives without an id', () => {
		const { client, emitUser } = makeApollo();
		const { homePagePath, portfolioPath } = mountComposable(client);
		emitUser({ my: { name: 'Test User' } });
		expect(homePagePath.value).toBe('/');
		expect(portfolioPath.value).toBe('/portfolio');
	});

	it('keeps the logged-out destinations when the fetch fails', () => {
		const { client, emitFailure } = makeApollo();
		const { homePagePath, portfolioPath } = mountComposable(client);
		emitFailure(new Error('Network error'));
		expect(homePagePath.value).toBe('/');
		expect(portfolioPath.value).toBe('/portfolio');
	});

	it('keeps the logged-out destinations when graphql errors arrive instead of the user', () => {
		const { client, emitErrors } = makeApollo();
		const { homePagePath, portfolioPath } = mountComposable(client);
		emitErrors([{ message: 'failed', code: 'api.error' }]);
		expect(homePagePath.value).toBe('/');
		expect(portfolioPath.value).toBe('/portfolio');
	});

	it('keeps the logged-out destinations when apollo is not provided', () => {
		const { homePagePath, portfolioPath } = mountComposable(null);
		expect(homePagePath.value).toBe('/');
		expect(portfolioPath.value).toBe('/portfolio');
	});
});
