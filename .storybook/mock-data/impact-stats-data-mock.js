import countryFacetsMock from './country-facets-data-mock';

const facetCountries = countryFacetsMock.data.lend.countryFacets.map(({ country }, index) => ({
	id: index + 1,
	isoCode: country.isoCode,
	name: country.name,
	region: country.region,
}));

const facetCountryByIsoCode = Object.fromEntries(facetCountries.map(country => [country.isoCode, country]));

const countriesNoLongerLentIn = {
	MA: { id: 1001, isoCode: 'MA', name: 'Morocco', region: 'Africa' },
	VC: { id: 1002, isoCode: 'VC', name: 'Saint Vincent and the Grenadines', region: 'North America' },
};

const middleEastLoans = facetCountries
	.filter(country => country.region === 'Middle East')
	.map(country => [country.isoCode, 1]);

const designLenderLoans = [
	['PH', 32], ['KE', 22], ['CO', 18], ['MA', 14], ['PE', 9], ['HT', 3], ['DO', 2], ['VC', 1], ...middleEastLoans,
];

export const impactStatsPublicData = {
	lend: {
		countryFacets: facetCountries.map(country => ({ country })),
	},
	general: {
		excluded_countries: { key: 'ui.excluded_countries', value: '"ZA, CA, AU"' },
	},
};

export const impactStatsLender = ({
	balance = '847.23',
	amountOutstanding = '3240.00',
	borrowers = 284,
	loans = designLenderLoans,
	countries = loans.length,
	donated = '120.00',
	lifetimeLent = '4240.00',
} = {}) => ({
	id: 1,
	userAccount: {
		id: 1, firstName: 'James', balance, promoBalance: '0.00',
	},
	userStats: { amount_outstanding: amountOutstanding, amount_donated: donated, amount_of_loans: lifetimeLent },
	lendingStats: {
		id: 1,
		lentTo: {
			borrowers: { totalCount: borrowers },
			countries: { totalCount: countries },
		},
	},
	statsPerCountry: {
		values: loans.map(([isoCode, loanCount]) => ({
			id: `country-${isoCode}`,
			loanCount,
			country: facetCountryByIsoCode[isoCode] ?? countriesNoLongerLentIn[isoCode],
		})),
	},
});
