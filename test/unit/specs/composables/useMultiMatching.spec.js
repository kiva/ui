import { nextTick } from 'vue';
import { render } from '@testing-library/vue';
import { globalOptions } from '#src/../test/unit/specUtils';
import { preFetchOperations } from '#src/composables/useMultiMatching';
import UsesMultiMatching from '#src/../test/unit/fixtures/composables/UsesMultiMatching';

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

// Reads the prefetched value from cacheData, and captures the watch query
// observer so a test can deliver a later result from the client
function makeSettingApollo(cacheData = null) {
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
		emitSetting: data => observer.next({ data }),
		emitErrors: errors => observer.next({ data: undefined, errors }),
		emitFailure: e => observer.error(e),
	};
}

// The build step attaches the composable's operations to the fixture, the same
// way it does for every component importing the composable
function renderFixture(apollo) {
	return render(UsesMultiMatching, {
		global: { ...globalOptions, provide: { ...globalOptions.provide, apollo } },
	});
}

describe('useMultiMatching', () => {
	it('reports unresolved and disabled before the setting arrives', () => {
		const { getByTestId } = renderFixture(makeSettingApollo().client);
		expect(getByTestId('enabled').textContent).toBe('false');
		expect(getByTestId('resolved').textContent).toBe('false');
	});

	it('enables multi matching when the setting arrives enabled', async () => {
		const { client, emitSetting } = makeSettingApollo();
		const { getByTestId } = renderFixture(client);
		emitSetting(enabledData('true'));
		await nextTick();
		expect(getByTestId('enabled').textContent).toBe('true');
		expect(getByTestId('resolved').textContent).toBe('true');
	});

	it('stays disabled but resolved when the setting arrives disabled', async () => {
		const { client, emitSetting } = makeSettingApollo();
		const { getByTestId } = renderFixture(client);
		emitSetting(enabledData('false'));
		await nextTick();
		expect(getByTestId('enabled').textContent).toBe('false');
		expect(getByTestId('resolved').textContent).toBe('true');
	});

	it('resolves synchronously from a prefetched cache value', () => {
		const { getByTestId } = renderFixture(makeSettingApollo(enabledData('true')).client);
		expect(getByTestId('enabled').textContent).toBe('true');
		expect(getByTestId('resolved').textContent).toBe('true');
	});

	it('resolves to the disabled default when the fetch fails', async () => {
		const { client, emitFailure } = makeSettingApollo();
		const { getByTestId } = renderFixture(client);
		emitFailure(new Error('Network error'));
		await nextTick();
		expect(getByTestId('enabled').textContent).toBe('false');
		expect(getByTestId('resolved').textContent).toBe('true');
	});

	it('registers its operation for prefetching', () => {
		expect(preFetchOperations).toHaveLength(1);
		expect(preFetchOperations[0].query).toBeDefined();
	});

	it('resolves to the disabled default when graphql errors arrive instead of the setting', async () => {
		const { client, emitErrors } = makeSettingApollo();
		const { getByTestId } = renderFixture(client);
		emitErrors([{ message: 'failed', code: 'api.error' }]);
		await nextTick();
		expect(getByTestId('enabled').textContent).toBe('false');
		expect(getByTestId('resolved').textContent).toBe('true');
	});

	it('stays unresolved and disabled when apollo is not provided', () => {
		const { getByTestId } = renderFixture(null);
		expect(getByTestId('enabled').textContent).toBe('false');
		expect(getByTestId('resolved').textContent).toBe('false');
	});
});
