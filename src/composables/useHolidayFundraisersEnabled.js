import { computed } from 'vue';
import uiConfigSettingQuery from '#src/graphql/query/uiConfigSetting.graphql';
import { readBoolSetting } from '#src/util/settingsUtils';
import useApolloQuery from '#src/composables/useApolloQuery';

export const HOLIDAY_FUNDRAISERS_SETTING_KEY = 'holiday_fundraisers_enable';

const variables = { key: HOLIDAY_FUNDRAISERS_SETTING_KEY };
const operation = {
	query: uiConfigSettingQuery,
	preFetchVariables: () => variables,
};

// Registered for prefetching by every component that imports this composable
export const preFetchOperations = [operation];

/**
 * Whether the holiday fundraiser entry points are switched on, driven by the
 * holiday_fundraisers_enable Kiva Admin setting. Off while loading and when the setting is missing.
 *
 * @returns {{ isHolidayFundraisersEnabled: import('vue').ComputedRef<boolean> }}
 */
export default function useHolidayFundraisersEnabled() {
	const { result } = useApolloQuery(operation, variables);

	const isHolidayFundraisersEnabled = computed(
		() => readBoolSetting(result.value, 'general.uiConfigSetting.value') ?? false
	);

	return { isHolidayFundraisersEnabled };
}
