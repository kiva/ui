import { ref } from 'vue';
import useCountryReach from '#src/composables/useCountryReach';

const facets = codes => codes.map(isoCode => ({ country: { id: isoCode, isoCode } }));
const data = (codes, excluded = null) => ({
	lend: { countryFacets: codes && facets(codes) },
	general: { excluded_countries: excluded === null ? null : { key: 'ui.excluded_countries', value: excluded } },
});

describe('useCountryReach', () => {
	it('counts facet countries that are not excluded', () => {
		const { availableCountryCount } = useCountryReach(() => data(['KE', 'ZA', 'PE', 'CA'], '"ZA, CA, AU"'));
		expect(availableCountryCount.value).toBe(2);
	});

	it('counts every facet country when the setting is missing', () => {
		const { availableCountryCount } = useCountryReach(() => data(['KE', 'ZA']));
		expect(availableCountryCount.value).toBe(2);
	});

	it('skips facets without a country', () => {
		const source = { lend: { countryFacets: [{ country: null }, ...facets(['KE'])] } };
		const { availableCountryCount } = useCountryReach(() => source);
		expect(availableCountryCount.value).toBe(1);
	});

	it('returns null without facets', () => {
		expect(useCountryReach(() => data(null)).availableCountryCount.value).toBeNull();
		expect(useCountryReach(() => null).availableCountryCount.value).toBeNull();
	});

	it('follows its source', () => {
		const source = ref(data(['KE']));
		const { availableCountryCount } = useCountryReach(source);
		expect(availableCountryCount.value).toBe(1);
		source.value = data(['KE', 'PE']);
		expect(availableCountryCount.value).toBe(2);
	});
});
