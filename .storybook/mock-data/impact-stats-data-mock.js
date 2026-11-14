const facetCodes = [
	'KE', 'PE', 'ZA', 'CA', 'KH', 'WS', 'MZ', 'PH', 'UG', 'RW', 'TZ', 'NG', 'GH', 'SN', 'ML', 'BF', 'TG',
	'BJ', 'CO', 'EC', 'BO', 'PY', 'GT', 'HN', 'SV', 'NI', 'MX', 'US', 'PK', 'IN', 'ID', 'VN', 'TJ', 'KG',
];

export const impactStatsPublicData = {
	lend: {
		countryFacets: facetCodes.map((isoCode, index) => ({ country: { id: index + 1, isoCode } })),
	},
	general: {
		excluded_countries: { key: 'ui.excluded_countries', value: '"ZA, CA, AU"' },
	},
};

export const impactStatsLender = ({
	balance = '847.23',
	amountOutstanding = '3240.00',
	borrowers = 284,
	countries = 7,
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
});
