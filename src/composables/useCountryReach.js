import { computed, toValue } from 'vue';
import { readListSetting } from '#src/util/settingsUtils';

/**
 * The countries Kiva lends in today: the lend country facets minus the excluded countries setting.
 *
 * @param {Ref|Function} source Query data with `lend.countryFacets` and `general.excluded_countries`
 * @returns {{ availableCountries: ComputedRef<object[]|null>, availableCountryCount: ComputedRef<number|null> }}
 */
export default function useCountryReach(source) {
	const availableCountries = computed(() => {
		const data = toValue(source);
		const countryFacets = data?.lend?.countryFacets;
		if (!countryFacets) return null;

		const excluded = new Set(readListSetting(data, 'general.excluded_countries.value'));
		return countryFacets
			.map(facet => facet?.country)
			.filter(country => country && !excluded.has(country.isoCode));
	});

	const availableCountryCount = computed(() => availableCountries.value?.length ?? null);

	return { availableCountries, availableCountryCount };
}
