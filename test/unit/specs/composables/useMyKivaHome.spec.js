import { nextTick } from 'vue';
import { render } from '@testing-library/vue';
import { globalOptions } from '#src/../test/unit/specUtils';
import { preFetchOperations } from '#src/composables/useMyKivaHome';
import UsesMyKivaHome from '#src/../test/unit/fixtures/composables/UsesMyKivaHome';

vi.mock('#src/graphql/query/userId.graphql', () => ({
	default: { kind: 'Document', definitions: [{ name: { value: 'userId' } }] },
}));

// Reads the prefetched value from cacheData, and captures the watch query
// observer so a test can deliver a later result from the client
function makeUserIdApollo(cacheData = null) {
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

// The build step attaches the composable's operations to the fixture, the same
// way it does for every component importing the composable
function renderFixture(apollo) {
	return render(UsesMyKivaHome, {
		global: { ...globalOptions, provide: { ...globalOptions.provide, apollo } },
	});
}

describe('useMyKivaHome', () => {
	it('returns the homePagePath and portfolioPath computed properties', () => {
		const { getByTestId } = renderFixture(makeUserIdApollo().client);
		expect(getByTestId('home')).toBeDefined();
		expect(getByTestId('portfolio')).toBeDefined();
	});

	it('registers its operation for prefetching', () => {
		expect(preFetchOperations).toHaveLength(1);
		expect(preFetchOperations[0].query).toBeDefined();
	});

	it('resolves both paths to my kiva from a prefetched cache value', () => {
		const { getByTestId } = renderFixture(makeUserIdApollo({ my: { id: 456 } }).client);
		expect(getByTestId('home').textContent).toBe('/mykiva');
		expect(getByTestId('portfolio').textContent).toBe('/mykiva');
	});

	it('resolves to the logged-out destinations when the prefetched value has no user', () => {
		const { getByTestId } = renderFixture(makeUserIdApollo({ my: null }).client);
		expect(getByTestId('home').textContent).toBe('/');
		expect(getByTestId('portfolio').textContent).toBe('/portfolio');
	});

	it('resolves to the logged-out destinations before the user arrives', () => {
		const { getByTestId } = renderFixture(makeUserIdApollo().client);
		expect(getByTestId('home').textContent).toBe('/');
		expect(getByTestId('portfolio').textContent).toBe('/portfolio');
	});

	it('switches both paths to my kiva when the user arrives on the client', async () => {
		const { client, emitUser } = makeUserIdApollo();
		const { getByTestId } = renderFixture(client);
		emitUser({ my: { id: 789 } });
		await nextTick();
		expect(getByTestId('home').textContent).toBe('/mykiva');
		expect(getByTestId('portfolio').textContent).toBe('/mykiva');
	});

	it('keeps the logged-out destinations when the user arrives without an id', async () => {
		const { client, emitUser } = makeUserIdApollo();
		const { getByTestId } = renderFixture(client);
		emitUser({ my: { name: 'Test User' } });
		await nextTick();
		expect(getByTestId('home').textContent).toBe('/');
		expect(getByTestId('portfolio').textContent).toBe('/portfolio');
	});

	it('keeps the logged-out destinations when the fetch fails', async () => {
		const { client, emitFailure } = makeUserIdApollo();
		const { getByTestId } = renderFixture(client);
		emitFailure(new Error('Network error'));
		await nextTick();
		expect(getByTestId('home').textContent).toBe('/');
		expect(getByTestId('portfolio').textContent).toBe('/portfolio');
	});

	it('keeps the logged-out destinations when graphql errors arrive instead of the user', async () => {
		const { client, emitErrors } = makeUserIdApollo();
		const { getByTestId } = renderFixture(client);
		emitErrors([{ message: 'failed', code: 'api.error' }]);
		await nextTick();
		expect(getByTestId('home').textContent).toBe('/');
		expect(getByTestId('portfolio').textContent).toBe('/portfolio');
	});

	it('keeps the logged-out destinations when apollo is not provided', () => {
		const { getByTestId } = renderFixture(null);
		expect(getByTestId('home').textContent).toBe('/');
		expect(getByTestId('portfolio').textContent).toBe('/portfolio');
	});
});
