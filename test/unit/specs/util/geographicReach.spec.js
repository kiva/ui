import {
	LOAN_COUNT_TIERS, loanCountTier, formatShare, buildRegions, toMapCountries,
} from '#src/util/geographicReach';

const c = (isoCode, name, region) => ({ isoCode, name, region });
const PH = c('PH', 'Philippines', 'Asia');
const IN = c('IN', 'India', 'Asia');
const ID = c('ID', 'Indonesia', 'Asia');
const KE = c('KE', 'Kenya', 'Africa');
const GH = c('GH', 'Ghana', 'Africa');
const MA = c('MA', 'Morocco', 'Africa');
const HT = c('HT', 'Haiti', 'North America');
const DO = c('DO', 'Dominican Republic', 'North America');
const stat = (country, loanCount) => ({ loanCount, country });
const names = region => region.countries.map(country => country.isoCode);
const regionNamed = (regions, name) => regions.find(region => region.name === name);
const countryIn = (regions, regionName, isoCode) => regionNamed(regions, regionName).countries
	.find(country => country.isoCode === isoCode);

describe('geographicReach', () => {
	describe('loanCountTier', () => {
		it('uses the map\'s tier bounds', () => {
			expect(LOAN_COUNT_TIERS).toEqual([1, 4, 7, 10, 13]);
		});

		it.each([
			[0, null], [1, 0], [3, 0], [4, 1], [6, 1], [7, 2], [9, 2], [10, 3], [12, 3], [13, 4], [250, 4],
		])('puts %i loans in tier %s', (loanCount, tier) => {
			expect(loanCountTier(loanCount)).toBe(tier);
		});
	});

	describe('formatShare', () => {
		it.each([
			[0.32, '32%'], [1, '100%'], [0.005, '1%'], [0.0049, '<1%'], [1 / 300, '<1%'],
		])('shows %f as %s', (share, text) => {
			expect(formatShare(share)).toBe(text);
		});
	});

	describe('buildRegions', () => {
		it('orders regions by name', () => {
			const regions = buildRegions([stat(HT, 1)], [PH, KE, HT]);

			expect(regions.map(region => region.name)).toEqual(['Africa', 'Asia', 'North America']);
		});

		it('lists lent-to countries by loans, then the rest by name', () => {
			const regions = buildRegions([stat(PH, 2), stat(IN, 5)], [ID, PH, IN]);

			expect(names(regionNamed(regions, 'Asia'))).toEqual(['IN', 'PH', 'ID']);
		});

		it('breaks a tie in loans by name', () => {
			const regions = buildRegions([stat(PH, 3), stat(IN, 3)], [PH, IN]);

			expect(names(regionNamed(regions, 'Asia'))).toEqual(['IN', 'PH']);
		});

		it('gives each lent-to country its share of all loans and its tier', () => {
			const regions = buildRegions([stat(PH, 32), stat(KE, 8)], [PH, KE]);

			expect(countryIn(regions, 'Asia', 'PH')).toEqual({
				isoCode: 'PH', name: 'Philippines', loanCount: 32, share: 0.8, tier: 4,
			});
			expect(countryIn(regions, 'Africa', 'KE')).toEqual({
				isoCode: 'KE', name: 'Kenya', loanCount: 8, share: 0.2, tier: 2,
			});
		});

		it('leaves countries not lent to without loans, share or tier', () => {
			const regions = buildRegions([stat(KE, 1)], [KE, GH]);

			expect(countryIn(regions, 'Africa', 'GH')).toEqual({
				isoCode: 'GH', name: 'Ghana', loanCount: 0, share: null, tier: null,
			});
		});

		it('lists a lent-to country Kiva no longer lends in under its region', () => {
			const regions = buildRegions([stat(KE, 1), stat(MA, 1)], [KE, GH]);

			expect(names(regionNamed(regions, 'Africa'))).toEqual(['KE', 'MA', 'GH']);
			expect(countryIn(regions, 'Africa', 'MA').share).toBe(0.5);
		});

		it('marks a region complete when every country Kiva lends in has loans', () => {
			const regions = buildRegions([stat(HT, 3), stat(DO, 2), stat(KE, 1)], [HT, DO, KE, GH]);

			expect(regionNamed(regions, 'North America').complete).toBe(true);
			expect(regionNamed(regions, 'Africa').complete).toBe(false);
		});

		it('ignores countries Kiva no longer lends in for Complete', () => {
			expect(regionNamed(buildRegions([stat(KE, 1), stat(MA, 1)], [KE]), 'Africa').complete).toBe(true);
			expect(regionNamed(buildRegions([stat(MA, 1)], [KE]), 'Africa').complete).toBe(false);
		});

		it('never marks a region with no countries Kiva lends in complete', () => {
			const regions = buildRegions([stat(MA, 1)], [PH]);

			expect(regionNamed(regions, 'Africa').complete).toBe(false);
		});

		it('groups countries without a region under Other, last', () => {
			const regions = buildRegions([stat(c('XK', 'Kosovo', null), 1)], [PH]);

			expect(regions.map(region => region.name)).toEqual(['Asia', 'Other']);
			expect(names(regionNamed(regions, 'Other'))).toEqual(['XK']);
		});

		it('lists every country, none complete, for a lender with no loans', () => {
			const regions = buildRegions([], [PH, KE]);

			expect(regions.flatMap(region => region.countries).map(country => country.loanCount)).toEqual([0, 0]);
			expect(regions.map(region => region.complete)).toEqual([false, false]);
		});

		it('names a country without a name by its code', () => {
			const regions = buildRegions([], [c('XX', null, 'Asia'), PH]);

			expect(names(regionNamed(regions, 'Asia'))).toEqual(['PH', 'XX']);
			expect(countryIn(regions, 'Asia', 'XX').name).toBe('XX');
		});

		it('skips stats without a country', () => {
			const regions = buildRegions([{ loanCount: 4, country: null }, stat(PH, 1)], [PH]);

			expect(countryIn(regions, 'Asia', 'PH').share).toBe(1);
		});

		it('returns no regions without countries', () => {
			expect(buildRegions([], [])).toEqual([]);
		});
	});

	describe('toMapCountries', () => {
		it('gives the map every country, with loans only on lent-to ones', () => {
			const mapCountries = toMapCountries(buildRegions([stat(PH, 2)], [PH, IN]));

			expect(mapCountries).toEqual([
				{ id: 'PH', name: 'Philippines', loanCount: 2 },
				{ id: 'IN', name: 'India' },
			]);
			expect('loanCount' in mapCountries[1]).toBe(false);
		});
	});
});
