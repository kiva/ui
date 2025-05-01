import fetchGraphQL from '../fetchGraphQL.js';
import { warn, error } from '../log.js';

export const QUERY_TYPE = {
	DEFAULT: 'default',
	FLSS: 'flss',
	RECOMMENDATIONS: 'recommendations'
};

// Number of loans to fetch
const loanCount = 4;

// Which loan properties to fetch
const loanData = `
	name
	id
	activity {
		id
		name
	}
	borrowerCount
	distributionModel
	geocode {
		country {
			name
		}
	}
	use
	loanAmount
	sector {
		id
		name
	}
	status
	tags
	loanFundraisingInfo {
		id
		fundedAmount
	}
	image {
		retina: url(customSize: "w960h720")
	}
	... on LoanPartner {
		themes
	}
`;

const loanValues = `values {
	${loanData}
}`;

const tagsQuery = {
	query: `query {
  		lend {
    		tag {
      			id
      			name
      			vocabularyId
    		}
  		}
	}`
};

// Make a graphql query <request> and return the results found at <resultPath>
async function fetchLoansFromGraphQL(request, resultPath) {
	try {
		const [data, tagsData] = await Promise.all([
			// Fetch loan data
			await fetchGraphQL(request, resultPath),
			// Fetch tags data to filter public tags
			await fetchGraphQL(tagsQuery, 'data.lend.tag')
		]);
		if (Array.isArray(data)) {
			// Ensure no falsy values are included in the returned array and add tagsData to each loan
			const loansData = data
				.filter(x => x)
				.map(loan => ({
					...loan,
					tagsData
				}));
			return loansData;
		}
		if (typeof data === 'object' && data !== null) {
			return [{ ...data, tagsData }];
		}
		return [];
	} catch (err) {
		error(`Error fetching loans: ${err}`, { error: err });
	}
}

// Get per-user recommended loans from the ML service
async function fetchRecommendationsByLoginId(id, queryType = QUERY_TYPE.DEFAULT) {
	if (queryType === QUERY_TYPE.RECOMMENDATIONS) {
		return fetchLoansFromGraphQL(
			{
				query: `query($userId: Int) {
					loanRecommendations(
						userId: $userId,
						limit: ${loanCount},
						origin: "email:live-loans"
					) {
						${loanValues}
					}
				}`,
				variables: {
					userId: Number(id)
				}
			},
			'data.loanRecommendations.values'
		);
	} if (queryType === QUERY_TYPE.FLSS) {
		return fetchLoansFromGraphQL(
			{
				query: `query($userId: Int) {
					fundraisingLoans(
						pageNumber: 0,
						limit: ${loanCount},
						userId: $userId,
						origin: "email:live-loans"
					) {
						${loanValues}
					}
				}`,
				variables: {
					userId: Number(id),
				}
			},
			'data.fundraisingLoans.values'
		);
	}
	return fetchLoansFromGraphQL(
		{
			query: `{
				ml {
					recommendationsByLoginId(
						segment: all
							loginId: ${id}
							offset: 0
							limit: ${loanCount}
					) {
						${loanValues}
					}
				}
			}`,
		},
		'data.ml.recommendationsByLoginId.values'
	);
}

// Get loan-to-loan recommended loans from the ML service
async function fetchRecommendationsByLoanId(id) {
	return fetchLoansFromGraphQL(
		{
			query: `{
				ml {
					relatedLoansByTopics(
						loanId: ${id},
						offset: 0,
						topics: [story]
						limit: ${loanCount},
					) {
						${loanValues}
					}
				}
			}`,
		},
		'data.ml.relatedLoansByTopics[0].values'
	);
}

// Get mapping of sector name to id
async function fetchSectors() {
	// If needed, these could be fetched async from legacy api, though be sure to cache results!
	// return fetchGraphQL(
	// 	{ query: '{ lend { sector { id name } } }' },
	// 	'data.lend.sector'
	// );
	// Return constant result for now.
	return Promise.resolve([
		{ id: 1, name: 'Agriculture' },
		{ id: 3, name: 'Transportation' },
		{ id: 4, name: 'Services' },
		{ id: 5, name: 'Clothing' },
		{ id: 6, name: 'Health' },
		{ id: 7, name: 'Retail' },
		{ id: 8, name: 'Manufacturing' },
		{ id: 9, name: 'Arts' },
		{ id: 10, name: 'Housing' },
		{ id: 12, name: 'Food' },
		{ id: 13, name: 'Wholesale' },
		{ id: 14, name: 'Construction' },
		{ id: 15, name: 'Education' },
		{ id: 16, name: 'Personal Use' },
		{ id: 17, name: 'Entertainment' }
	]);
}

// Get possible sorting options
async function fetchSorts() {
	return Promise.resolve([
		'amountLeft',
		'expiringSoon',
		'loanAmount',
		'loanAmountDesc',
		'newest',
		'popularity',
		'random',
		'repaymentTerm'
	]);
}

async function fetchFLSSSorts() {
	return Promise.resolve([
		'amountHighToLow',
		'amountLeft',
		'amountLowToHigh',
		'expiringSoon',
		'mostRecent',
		'personalized',
		'personalizedAutolending',
		'personalizedFallback',
		'popularityScore',
		'repaymentTerm',
		'researchScore'
	]);
}

// Get possible themes
async function fetchThemes() {
	// If needed, these could be fetched async from legacy api, though be sure to cache results!
	// return fetchGraphQL(
	// 	{ query: '{ lend { loanThemeFilter { id name } } }' },
	// 	'data.lend.loanThemeFilter'
	// );
	// Return constant result for now.
	return Promise.resolve([
		{ id: 1, name: 'Green' },
		{ id: 2, name: 'Higher Education' },
		{ id: 5, name: 'Islamic Finance' },
		{ id: 6, name: 'Youth' },
		{ id: 7, name: 'Start-Up' },
		{ id: 8, name: 'Water and Sanitation' },
		{ id: 9, name: 'Vulnerable Groups' },
		{ id: 10, name: 'Fair Trade' },
		{ id: 11, name: 'Rural Exclusion' },
		{ id: 12, name: 'Mobile Technology' },
		{ id: 13, name: 'Underfunded Areas' },
		{ id: 14, name: 'Conflict Zones' },
		{ id: 15, name: 'Job Creation' },
		{ id: 17, name: 'Growing Businesses' },
		{ id: 20, name: 'Disaster recovery' },
		{ id: 24, name: 'Innovative Loans' },
		{ id: 28, name: 'Refugees/Displaced' },
		{ id: 29, name: 'Social Enterprise' },
		{ id: 30, name: 'Earth Day Campaign' },
		{ id: 32, name: 'Clean Energy' },
		{ id: 36, name: 'Crisis Support Loans' }
	]);
}

async function fetchTags() {
	return Promise.resolve([
		{ id: 43, name: 'U.S. Black-owned Businesses' },
		{ id: 45, name: 'Latinx/Hispanic Owned Business' },
		{ id: 28, name: 'Repeat Borrower' }
	]);
}

// Parse the filter string and return an array of filter arrays, e.g. [['sector', 'arts'], ['country', 'ke']]
// Returns an empty array if the filter string does not contain any valid matches.
const getFilterArrays = filterString => {
	// This regex matches strings like 'sector_arts,country_ke' and captures each
	// param name and value (for example 'sector', 'arts', 'country', 'ke' would be captured).
	// See tests, examples, and a more detailed explanation at regexr.com/659in
	const searchParamRegex = /(?:([a-z]+)_([a-z0-9 .\\/-]+),?)+?/g;
	// Match the regex against the filter string, returning an iterator of all the matches and captured groups
	const matches = filterString.toLowerCase().matchAll(searchParamRegex);

	// Return an array of the matches as filter names and values, like [['sector', 'arts'], ['country', 'ke']]
	return [...matches].map(match => [match[1], match[2]]);
};

// Helper function to find possible filter options from a given list
const findFilterOption = (options, name, value) => {
	const option = options.find(o => o?.name?.toLowerCase() === value);
	if (!option) {
		warn(`Unknown ${name} "${value}"`);
	}
	return option;
};

// Takes a string like: "sort_expiringSoon,gender_female"
// and extracts the sort option, e.g. "expiringSoon"
function parseSortString(sortString, sortOptions) {
	let sort = null;

	// only try parsing if the input is valid
	if (sortString && typeof sortString === 'string') {
		// start pasring the string
		getFilterArrays(sortString)
			// remove any filter that isn't "sort"
			.filter(([name]) => name === 'sort')
			// return just the value of the sort option
			.map(array => array?.[1])
			// if the sort option value is valid, set it as the sort to be returned
			.forEach(value => {
				const sortOption = sortOptions.find(o => o?.toLowerCase() === value);
				if (sortOption) {
					sort = sortOption;
				}
			});
	}
	return sort;
}

// Only returns true for supported FLSS loan search filters
const supportedFilterFLSS = name => {
	switch (name) {
		case 'country':
		case 'gender':
		case 'sector':
		case 'theme':
		case 'tag':
		case 'amountleft':
			return true;
		default:
			warn(`Unsupported FLSS filter "${name}"`);
			return false;
	}
};

// Takes a string like: "gender_female,sector_education"
// and returns an array of objects like: [ { gender: { eq: 'female' } }, { sector: { eq: 'education' } } ]
const parseFilterStringFLSS = async filterString => {
	// If the filter string is not valid, return an empty array
	if (!filterString || typeof filterString !== 'string') {
		return null;
	}

	// Create a single filter object with all properties
	const combinedFilter = {};

	// Helper function to add an array filter
	const addArrayFilterValue = (name, value) => {
		// Create the array if it doesn't exist
		combinedFilter[name] = combinedFilter[name] || { any: [] };
		// Add the value to the existing array
		combinedFilter[name].any.push(value);
	};

	// Helper function to add a range filter
	const addRangeFilterValue = (name, operator, value) => {
		// Convert the value to a number if needed
		const numValue = parseFloat(value);
		// Add the range filter
		combinedFilter[name] = { range: { [operator]: numValue } };
	};

	// Fetch possible filter options
	const tags = await fetchTags();

	// Start parsing the filter string
	getFilterArrays(filterString)
		.filter(([name]) => name !== 'sort')
		.filter(([name]) => supportedFilterFLSS(name))
		.forEach(([name, value]) => {
			// Special case for amountleft with "gte" operation
			// Value format would be "gte100" or "gte50", etc.
			if (name === 'amountleft' && value.startsWith('gte')) {
				// Extract the numeric part from the value (e.g., "gte100" -> "100")
				const numericValue = value.substring(3); // Remove "gte" prefix
				addRangeFilterValue('amountLeft', 'gte', numericValue);
			} else if (name === 'country') {
				// FLSS uses 'countryIsoCode' for the country filter
				addArrayFilterValue('countryIsoCode', value);
			} else if (name === 'tag') {
				// FLSS uses 'tagId' for the tag filter
				const tag = findFilterOption(tags, name, value);
				if (tag) {
					addArrayFilterValue('tagId', tag.id);
				}
			} else {
				// Other filters can be passed through directly
				addArrayFilterValue(name, value);
			}
		});

	// Return the combined filter in an array if any filters were added
	return Object.keys(combinedFilter).length ? [combinedFilter] : null;
};

// Get loans from the Fundraising Loan Search Service matching a set of filters
async function fetchRecommendationsByFilter(filterString) {
	const filters = await parseFilterStringFLSS(filterString);
	const sortOptions = await fetchFLSSSorts();
	const sortBy = parseSortString(filterString, sortOptions);
	return fetchLoansFromGraphQL(
		{
			query: `query($filters: [FundraisingLoanSearchFilterInput!], $sortBy: SortEnum) {
				fundraisingLoans(
					pageNumber: 0,
					limit: ${loanCount},
					filters: $filters,
					sortBy: $sortBy,
					origin: "email:live-loans"
				) {
					${loanValues}
				}
			}`,
			variables: {
				filters,
				sortBy,
			}
		},
		'data.fundraisingLoans.values'
	);
}

// Only returns true for supported legacy loan search filters
const supportedFilterLegacy = name => {
	switch (name) {
		case 'country':
		case 'gender':
		case 'sector':
		case 'sort':
		case 'theme':
		case 'tag':
			return true;
		default:
			warn(`Unsupported legacy filter "${name}"`);
			return false;
	}
};

// Takes a string like: "gender_female,sector_education"
// and converts it to a legacy filter object
async function parseFilterStringLegacy(filterString) {
	const filters = {};

	// Helper function to seet a single filter value
	const setFilterValue = (name, value) => {
		// Set the value directly
		filters[name] = value;
	};
	// Helper function to add to a value to an array filter
	const addArrayFilterValue = (name, value) => {
		// Make sure existing value is an array if it isn't already
		filters[name] = filters[name] || [];
		// Add the new value to the existing array
		filters[name].push(value);
	};

	// only try parsing if the input is valid
	if (filterString && typeof filterString === 'string') {
		// Fetch possible filter options
		const [sectors, themes, tags] = await Promise.all([fetchSectors(), fetchThemes(), fetchTags()]);
		// Start parsing the filter string
		getFilterArrays(filterString)
			// Remove any unsupported filters
			.filter(([name]) => supportedFilterLegacy(name))
			// Add each filter to the filter object
			.forEach(([name, value]) => {
				if (name === 'country') {
					addArrayFilterValue(name, value);
				} else if (name === 'gender') {
					setFilterValue(name, value);
				} else if (name === 'sector') {
					// Find the sector from the list of possible sectors
					const sector = findFilterOption(sectors, name, value);
					if (sector) {
						addArrayFilterValue(name, sector.id);
					}
				} else if (name === 'theme') {
					// Find the theme from the list of possible themes
					const theme = findFilterOption(themes, name, value);
					if (theme) {
						addArrayFilterValue(name, theme.name);
					}
				} else if (name === 'tag') {
					const tag = findFilterOption(tags, name, value);
					if (tag) {
						addArrayFilterValue('loanTags', tag.id);
					}
				}
			});
	}
	return filters;
}

// Get loans from legacy lend search matching a set of filters
async function fetchRecommendationsByLegacyFilter(filterString) {
	const [filters, sortOptions] = await Promise.all([
		parseFilterStringLegacy(filterString),
		fetchSorts(),
	]);
	const sort = parseSortString(filterString, sortOptions);
	return fetchLoansFromGraphQL(
		{
			query: `query($filters: LoanSearchFiltersInput, $sort: LoanSearchSortByEnum) {
				lend {
					loans(limit: ${loanCount}, offset: 0, filters: $filters, sortBy: $sort) {
						${loanValues}
					}
				}
			}`,
			variables: {
				filters,
				sort,
			},
		},
		'data.lend.loans.values'
	);
}

// Get loans from legacy lend search matching a set of filters
async function fetchLoanById(loanId) {
	return fetchLoansFromGraphQL(
		{
			query: `query($loanId: Int!) {
				lend {
					loan(id: $loanId) {
						${loanData}
					}
				}
			}`,
			variables: {
				loanId: Number(loanId),
			}
		},
		'data.lend.loan'
	);
}

// Check if the filter string contains any FLSS filters
const shouldUseFLSS = async filterString => {
	// input needs to be a string
	if (!filterString || typeof filterString !== 'string') {
		return true; // Returning true so that FLSS is the default
	}

	// Check which sort options are used in the filter string
	const [legacySorts, flssSorts] = await Promise.all([fetchSorts(), fetchFLSSSorts()]);
	const legacySort = parseSortString(filterString, legacySorts);
	const FLSSSort = parseSortString(filterString, flssSorts);
	const usingLegacySort = !!legacySort;
	const usingFLSSSort = !!FLSSSort;

	// If the filter string contains a sort option that is only supported by one of the services, use that service
	if (usingFLSSSort && !usingLegacySort) {
		return true;
	}
	if (usingLegacySort && !usingFLSSSort) {
		return false;
	}

	// Use FLSS by default
	return true;
};

// Export a function that will fetch loans by live-loan type and id
export default async function fetchLoansByType(type, id, queryType = QUERY_TYPE.DEFAULT) {
	if (type === 'user') {
		return fetchRecommendationsByLoginId(id, queryType);
	} if (type === 'loan') {
		return fetchRecommendationsByLoanId(id);
	} if (type === 'filter') {
		if (await shouldUseFLSS(id)) {
			return fetchRecommendationsByFilter(id);
		}
		warn(`Using legacy loan search for filter "${id}"`);
		return fetchRecommendationsByLegacyFilter(id);
	}
	if (type === 'loanid') {
		return fetchLoanById(id);
	}
	throw new Error('Type must be user, loan, or filter');
}
