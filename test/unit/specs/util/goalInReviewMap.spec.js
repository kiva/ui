import { getCountriesMapCenter, DEFAULT_MAP_CENTER } from '#src/util/goalInReviewMap';

const country = (latitude, longitude) => ({ geocode: { latitude, longitude } });

describe('goalInReviewMap.js', () => {
	describe('getCountriesMapCenter', () => {
		it('centres on the country itself when there is only one', () => {
			const center = getCountriesMapCenter([country(-9.2, -75)]);
			expect(center.lat).toBeCloseTo(-9.2);
			expect(center.long).toBeCloseTo(-75);
		});

		it('averages the position of several countries', () => {
			const center = getCountriesMapCenter([country(10, 20), country(20, 30)]);
			expect(center.lat).toBeCloseTo(15);
			expect(center.long).toBeCloseTo(25);
		});

		it('averages longitudes across the antimeridian instead of through Africa', () => {
			const center = getCountriesMapCenter([country(-20, -175), country(-18, 177)]);
			expect(Math.abs(center.long)).toBeGreaterThan(170);
		});

		it('treats 0,0 as a real coordinate rather than missing data', () => {
			expect(getCountriesMapCenter([country(0, 0)])).toEqual({ lat: 0, long: 0 });
		});

		it('ignores countries with no usable coordinates', () => {
			const center = getCountriesMapCenter([country(10, 20), { geocode: null }, {}]);
			expect(center.lat).toBeCloseTo(10);
			expect(center.long).toBeCloseTo(20);
		});

		it('falls back to the default centre with no usable countries', () => {
			expect(getCountriesMapCenter([])).toEqual(DEFAULT_MAP_CENTER);
			expect(getCountriesMapCenter()).toEqual(DEFAULT_MAP_CENTER);
			expect(getCountriesMapCenter([{ geocode: {} }])).toEqual(DEFAULT_MAP_CENTER);
		});
	});
});
