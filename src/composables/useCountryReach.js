import { computed, toValue } from 'vue';
import { readListSetting } from '#src/util/settingsUtils';

/**
 * Counts the countries Kiva lends in today: the lend country facets minus the excluded countries setting.
 *
 * @param {Ref|Function} source Query data with `lend.countryFacets` and `general.excluded_countries`
 * @returns {{ availableCountryCount: ComputedRef<number|null> }}
 */
export default function useCountryReach(source) {
	const availableCountryCount = computed(() => {
		const data = toValue(source);
		const countryFacets = data?.lend?.countryFacets;
		if (!countryFacets) return null;

		const excluded = new Set(readListSetting(data, 'general.excluded_countries.value'));
		return countryFacets.filter(facet => facet?.country && !excluded.has(facet.country.isoCode)).length;
	});

	return { availableCountryCount };
}
