import { nextTick } from 'vue';
import { render } from '@testing-library/vue';
import { globalOptions } from '#src/../test/unit/specUtils';
import {
	HOLIDAY_FUNDRAISERS_SETTING_KEY,
	preFetchOperations,
} from '#src/composables/useHolidayFundraisersEnabled';
import UsesHolidayFundraisersEnabled from '#src/../test/unit/fixtures/composables/UsesHolidayFundraisersEnabled';

vi.mock('#src/graphql/query/uiConfigSetting.graphql', () => ({
	default: { kind: 'Document', definitions: [{ name: { value: 'uiConfigSetting' } }] },
}));

function settingData(value) {
	return {
		general: {
			uiConfigSetting: { key: `ui.${HOLIDAY_FUNDRAISERS_SETTING_KEY}`, value },
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
		emitFailure: e => observer.error(e),
	};
}

function renderFixture(apollo) {
	return render(UsesHolidayFundraisersEnabled, {
		global: { ...globalOptions, provide: { ...globalOptions.provide, apollo } },
	});
}

describe('useHolidayFundraisersEnabled', () => {
	it('is off before the setting arrives', () => {
		const { getByTestId } = renderFixture(makeSettingApollo().client);
		expect(getByTestId('enabled').textContent).toBe('false');
	});

	it('is on when the setting is true', async () => {
		const { client, emitSetting } = makeSettingApollo();
		const { getByTestId } = renderFixture(client);
		emitSetting(settingData('true'));
		await nextTick();
		expect(getByTestId('enabled').textContent).toBe('true');
	});

	it('is off when the setting is false', async () => {
		const { client, emitSetting } = makeSettingApollo();
		const { getByTestId } = renderFixture(client);
		emitSetting(settingData('false'));
		await nextTick();
		expect(getByTestId('enabled').textContent).toBe('false');
	});

	it('reads a prefetched value synchronously', () => {
		const { getByTestId } = renderFixture(makeSettingApollo(settingData('true')).client);
		expect(getByTestId('enabled').textContent).toBe('true');
	});

	it('is off when the setting does not exist', async () => {
		const { client, emitSetting } = makeSettingApollo();
		const { getByTestId } = renderFixture(client);
		emitSetting({ general: { uiConfigSetting: null } });
		await nextTick();
		expect(getByTestId('enabled').textContent).toBe('false');
	});

	it('is off when the fetch fails', async () => {
		const { client, emitFailure } = makeSettingApollo();
		const { getByTestId } = renderFixture(client);
		emitFailure(new Error('Network error'));
		await nextTick();
		expect(getByTestId('enabled').textContent).toBe('false');
	});

	it('registers its operation for prefetching with the setting key', () => {
		expect(preFetchOperations).toHaveLength(1);
		expect(preFetchOperations[0].preFetchVariables()).toEqual({ key: HOLIDAY_FUNDRAISERS_SETTING_KEY });
	});
});
