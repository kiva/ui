/**
 * @typedef {object} GeographicCountry
 * @property {string} isoCode
 * @property {string} name
 * @property {number} loanCount 0 when not lent to
 * @property {number|null} share Fraction of the lender's loans, null when not lent to
 * @property {number|null} tier Index into LOAN_COUNT_TIERS, null when not lent to
 */

/**
 * @typedef {object} GeographicRegion
 * @property {string} name
 * @property {boolean} complete Every country Kiva lends in today has the lender's loans
 * @property {GeographicCountry[]} countries Lent-to countries by loans, then the rest by name
 */

/**
 * Ascending loan-count lower bounds of the map's tiers: 1–3, 4–6, 7–9, 10–12, 13+.
 */
export const LOAN_COUNT_TIERS = [1, 4, 7, 10, 13];

const OTHER_REGION = 'Other';

const byName = (a, b) => a.name.localeCompare(b.name);

const byLoansThenName = (a, b) => b.loanCount - a.loanCount || byName(a, b);

const otherLast = (a, b) => (a.name === OTHER_REGION) - (b.name === OTHER_REGION) || byName(a, b);

/**
 * @param {number} loanCount
 * @returns {number|null} Index into LOAN_COUNT_TIERS, null below the first tier
 */
export function loanCountTier(loanCount) {
	const tier = LOAN_COUNT_TIERS.filter(bound => loanCount >= bound).length - 1;
	return tier < 0 ? null : tier;
}

/**
 * @param {number} share Fraction of the lender's loans
 * @returns {string} Whole percent, or "<1%" when it rounds to 0
 */
export function formatShare(share) {
	const percent = Math.round(share * 100);
	return percent === 0 ? '<1%' : `${percent}%`;
}

/**
 * Groups every country Kiva lends in today, plus any other country the lender has lent to, by region.
 *
 * @param {Array<{ loanCount: number, country: { isoCode: string, name: string, region: string|null }|null }>} stats
 * @param {Array<{ isoCode: string, name: string, region: string|null }>} availableCountries
 * @returns {GeographicRegion[]} Regions by name, "Other" last
 */
export function buildRegions(stats, availableCountries) {
	const lentTo = stats.filter(stat => stat?.country);
	const totalLoans = lentTo.reduce((sum, stat) => sum + stat.loanCount, 0);
	const available = new Set(availableCountries.map(country => country.isoCode));

	const entries = new Map(availableCountries.map(country => [country.isoCode, { country, loanCount: 0 }]));
	lentTo.forEach(({ country, loanCount }) => {
		entries.set(country.isoCode, { country: entries.get(country.isoCode)?.country ?? country, loanCount });
	});

	const regions = new Map();
	entries.forEach(({ country, loanCount }) => {
		const name = country.region ?? OTHER_REGION;
		if (!regions.has(name)) {
			regions.set(name, []);
		}
		regions.get(name).push({
			isoCode: country.isoCode,
			name: country.name ?? country.isoCode,
			loanCount,
			share: loanCount > 0 ? loanCount / totalLoans : null,
			tier: loanCountTier(loanCount),
		});
	});

	return [...regions].map(([name, countries]) => {
		const lendsInToday = countries.filter(country => available.has(country.isoCode));
		return {
			name,
			complete: lendsInToday.length > 0 && lendsInToday.every(country => country.loanCount > 0),
			countries: countries.sort(byLoansThenName),
		};
	}).sort(otherLast);
}

/**
 * @param {GeographicRegion[]} regions
 * @returns {Array<{ id: string, name: string, loanCount?: number }>} KvSimpleMap countries, loans on lent-to only
 */
export function toMapCountries(regions) {
	return regions.flatMap(region => region.countries.map(({ isoCode, name, loanCount }) => (
		loanCount > 0 ? { id: isoCode, name, loanCount } : { id: isoCode, name }
	)));
}
