import _orderBy from 'lodash/orderBy';
import { sortRegions } from '@/util/loanSearch/countryUtils';
import { createMinMaxRange } from '@/util/loanSearch/minMaxRange';

/**
 * Used to map the sort value to display value
 */
export const sortByNameToDisplay = {
	// Shared
	expiringSoon: 'Ending soon',
	amountLeft: 'Amount left',
	repaymentTerm: 'Loan length',
	// Standard (lend)
	loanAmount: 'Amount: Low to High',
	loanAmountDesc: 'Amount: High to Low',
	newest: 'Most recent',
	popularity: 'Trending now',
	random: 'Random',
	// FLSS specific
	amountHighToLow: 'Amount: High to Low',
	amountLowToHigh: 'Amount: Low to High',
	personalized: 'Recommended',
	popularityScore: 'Trending now'
};

export const visibleFLSSSortOptions = [
	'expiringSoon',
	'amountHighToLow',
	'amountLowToHigh',
	'personalized',
];

export const experimentVisibleFLSSSortOptions = [
	'expiringSoon',
	'amountHighToLow',
	'amountLowToHigh',
	'personalized',
	'amountLeft',
	'popularityScore',
	'repaymentTerm',
];

/**
 * The themes/attributes that are always visible in the filter UI
 */
export const visibleThemeIds = [2, 6, 8, 11, 14, 28, 29, 32, 36];

/**
 * FLSS API query type
 */
export const FLSS_QUERY_TYPE = 'flss';

/**
 * Standard/lend API query type
 */
export const STANDARD_QUERY_TYPE = 'standard';

// Gender enum keys
export const FEMALE_KEY = 'FEMALE';
export const MALE_KEY = 'MALE';

// Distribution model enum keys
export const FIELDPARTNER_KEY = 'FIELDPARTNER';
export const DIRECT_KEY = 'DIRECT';

// Is individual option keys
export const INDIVIDUAL_KEY = 'INDIVIDUAL';
export const GROUP_KEY = 'GROUP';

// Lender repayment term option keys
export const EIGHT_MONTHS_KEY = 'EIGHT_MONTHS';
export const SIXTEEN_MONTHS_KEY = 'SIXTEEN_MONTHS';
export const TWO_YEARS_KEY = 'TWO_YEARS';
export const MORE_THAN_TWO_YEARS_KEY = 'MORE_THAN_TWO_YEARS_KEY';

/**
 * Maps the gender enum names to display names
 */
export const genderDisplayMap = {
	[FEMALE_KEY]: 'Women',
	[MALE_KEY]: 'Men'
};

/**
 * Maps the distribution model enum names to display names
 */
export const distributionModelDisplayMap = {
	[FIELDPARTNER_KEY]: 'Partner',
	[DIRECT_KEY]: 'Direct',
};

/**
 * Maps the is individual keys to display names
 */
export const isIndividualDisplayMap = {
	[INDIVIDUAL_KEY]: 'Individual',
	[GROUP_KEY]: 'Group',
};

/**
 * Maps the is individual keys to values
 */
export const isIndividualValueMap = {
	[INDIVIDUAL_KEY]: true,
	[GROUP_KEY]: false,
};

/**
 * Maps the lender repayment term keys to display names
 */
export const lenderRepaymentTermDisplayMap = {
	[EIGHT_MONTHS_KEY]: '8 mths or less',
	[SIXTEEN_MONTHS_KEY]: '16 mths or less',
	[TWO_YEARS_KEY]: '2 yrs or less',
	[MORE_THAN_TWO_YEARS_KEY]: '2 yrs or more'
};

/**
 * Maps the lender repayment term keys to values
 */
export const lenderRepaymentTermValueMap = {
	[EIGHT_MONTHS_KEY]: createMinMaxRange(0, 8),
	[SIXTEEN_MONTHS_KEY]: createMinMaxRange(0, 16),
	[TWO_YEARS_KEY]: createMinMaxRange(0, 24),
	[MORE_THAN_TWO_YEARS_KEY]: createMinMaxRange(24, 400),
};

/**
 * Categorizes Sort Options
 *
 * @param {Array<Object>} standardSorts Sort options from the lend API
 * @param {Array<Object>} flssSorts Sort options from the FLSS API
 * @param {boolean} extendFlssFilters Flag for FLSS experiment
 * @returns New formatted array
 */
export function formatSortOptions(standardSorts, flssSorts, extendFlssFilters) {
	const labeledStandardSorts = standardSorts?.map(sort => {
		return {
			name: sort.name,
			sortSrc: STANDARD_QUERY_TYPE,
		};
	}) ?? [];
	const labeledFlssSorts = flssSorts?.reduce((prev, current) => {
		const visibleOptions = extendFlssFilters ? experimentVisibleFLSSSortOptions : visibleFLSSSortOptions;
		if (visibleOptions.includes(current.name)) {
			prev.push({ name: current.name, sortSrc: FLSS_QUERY_TYPE });
		}

		return prev;
	}, []) ?? [];
	return [...labeledStandardSorts, ...labeledFlssSorts];
}

/**
 * Transforms ISO codes into regions usable by the filters
 *
 * @param {Array<Object>} countryFacets The ISO codes from FLSS
 * @param {Array<Object>} allCountryFacets The countries from lend API
 * @returns {Array<Object>} Regions with lists of countries
 */
export function transformIsoCodes(filteredIsoCodes, allCountryFacets = []) {
	const transformed = [];

	filteredIsoCodes.forEach(({ key: isoCode, value: numLoansFundraising }) => {
		// Create company object based on country defined by lend API
		const lookupCountry = allCountryFacets.find(({ country }) => {
			// Case insensitive matching just in case lend and FLSS APIs have different casing
			return country.isoCode.toUpperCase() === isoCode.toUpperCase();
		});
		if (!lookupCountry) return;
		const country = { ...lookupCountry.country, isoCode, numLoansFundraising };

		// Find existing transformed region or add a new region
		const region = transformed.find(t => t.region === country.region);
		if (region) {
			region.countries.push(country);
			region.numLoansFundraising += numLoansFundraising;
		} else {
			transformed.push({ region: country.region, countries: [country], numLoansFundraising });
		}
	});

	return sortRegions(transformed);
}

/**
 * Transforms filtered sectors into a form usable by the filters
 *
 * @param {Array<Object>} filteredSectors The sector IDs from FLSS
 * @param {Array<Object>} allSectors The sectors from lend API
 * @returns {Array<Object>} Sectors with number of loans fundraising
 */
export function transformSectors(filteredSectors, allSectors = []) {
	const transformed = [];

	filteredSectors.forEach(({ key: id, value: numLoansFundraising }) => {
		const lookupSector = allSectors.find(s => s.id === +id);
		if (!lookupSector) return;
		const sector = { id: lookupSector.id, name: lookupSector.name, numLoansFundraising };
		transformed.push(sector);
	});

	return _orderBy(transformed, 'name');
}

/**
 * Transforms filtered themes into a form usable by the filters
 *
 * @param {Array<Object>} filteredThemes The themes from FLSS
 * @param {Array<Object>} allThemes The themes from lend API
 * @returns {Array<Object>} Themes with number of loans fundraising
 */
export function transformThemes(filteredThemes, allThemes = []) {
	const transformed = [];

	// Always show certain themes regardless of whether there are applicable loans
	visibleThemeIds.forEach(id => {
		const themeFromLend = allThemes.find(a => a.id === id);

		if (!themeFromLend) return;

		// Case insensitive matching since lend and FLSS APIs can use different casing for themes
		const themeFromFlss = filteredThemes.find(t => t.key.toUpperCase() === themeFromLend.name.toUpperCase());

		const theme = { id, name: themeFromLend.name, numLoansFundraising: themeFromFlss?.value ?? 0 };

		transformed.push(theme);
	});

	return _orderBy(transformed, 'name');
}

/**
 * Transforms tag names for display
 *
 * @param {string} name The tag name to transform
 * @returns The transformed tag name
 */
export function transformTagName(name = '') {
	// Public tags start with a '#' which we don't want to display
	return name[0] === '#' ? name.substring(1) : name;
}

/**
 * Transforms tags into a form usable by the filters
 *
 * @param {Array<Object>} allTags The tags from lend API
 * @returns {Array<Object>} Tags usable by the filters
 */
export function transformTags(allTags = []) {
	// TODO: filter options against FLSS loan counts and add numLoansFundraising (VUE-1335)

	// Public tags have vocabularyId of 2
	const transformed = allTags.filter(t => t.vocabularyId === 2).map(t => {
		return {
			id: t.id,
			name: transformTagName(t.name),
		};
	});

	return _orderBy(transformed, 'name');
}

/**
 * Prepares the options to be used by a radio group
 *
 * @param {Array<Object>} options The options to transform
 * @param {Array<string>} order The order of the options (name property)
 * @param {Object} displayMap The map for name to display title
 * @param {Object} valueMap The map for name to value
 * @returns {Array<Object>} The transformed radio group options
 */
export function transformRadioGroupOptions(options, order, displayMap, valueMap = {}) {
	const capitalizedOrder = order.map(o => o.toUpperCase());

	const transformed = options.filter(o => capitalizedOrder.includes(o.name.toUpperCase())).map(o => {
		const key = o.name.toUpperCase();

		return {
			name: o.name,
			title: displayMap[key] ?? o,
			value: valueMap[key] ?? o.name,
		};
	}).sort((a, b) => capitalizedOrder.indexOf(a.name.toUpperCase()) - capitalizedOrder.indexOf(b.name.toUpperCase()));

	return transformed;
}

/**
 * Prepares the gender options to be used by a radio group
 *
 * @param {Array<Object>} genders The genders to transform
 * @returns {Array<Object>} The transformed radio group options
 */
export function transformGenderOptions(genders) {
	return transformRadioGroupOptions(genders, [FEMALE_KEY, MALE_KEY], genderDisplayMap);
}

/**
 * Prepares the distribution model options to be used by a radio group
 *
 * @param {Array<Object>} distributionModels The distribution models to transform
 * @returns {Array<Object>} The transformed radio group options
 */
export function transformDistributionModelOptions(distributionModels) {
	return transformRadioGroupOptions(distributionModels, [FIELDPARTNER_KEY, DIRECT_KEY], distributionModelDisplayMap);
}

/**
 * Prepares the is individual options to be used by a radio group
 *
 * @returns The transformed radio group options
 */
export function transformIsIndividualOptions() {
	const options = [{ name: INDIVIDUAL_KEY }, { name: GROUP_KEY }];
	const order = [INDIVIDUAL_KEY, GROUP_KEY];
	return transformRadioGroupOptions(options, order, isIndividualDisplayMap, isIndividualValueMap);
}

/**
 * Prepares the lender repayment term options to be used by a radio group
 *
 * @returns The transformed radio group options
 */
export function transformLenderRepaymentTermOptions() {
	const options = [
		{ name: EIGHT_MONTHS_KEY },
		{ name: SIXTEEN_MONTHS_KEY },
		{ name: TWO_YEARS_KEY },
		{ name: MORE_THAN_TWO_YEARS_KEY }
	];
	const order = [EIGHT_MONTHS_KEY, SIXTEEN_MONTHS_KEY, TWO_YEARS_KEY, MORE_THAN_TWO_YEARS_KEY];
	return transformRadioGroupOptions(options, order, lenderRepaymentTermDisplayMap, lenderRepaymentTermValueMap);
}

/**
 * Transforms partners into a form usable by the select box
 *
 * @param {Array<Object>} partners The partners from the lend API
 * @returns {Array<Object>} Partners sorted by region and partner name
 */
export function transformPartners(partners) {
	const order = [
		'NORTH AMERICA',
		'CENTRAL AMERICA',
		'SOUTH AMERICA',
		'AFRICA',
		'EASTERN EUROPE',
		'MIDDLE EAST',
		'ASIA',
		'OCEANIA'
	];

	const transformed = [];

	partners.forEach(({ id, name, countries }) => {
		const region = countries?.[0]?.region ?? '';

		transformed.push({
			id,
			name,
			region,
		});
	});

	// Sort by region order array, then partner name
	transformed.sort((a, b) => {
		if (a.region !== b.region) {
			const aIndex = order.indexOf(a.region.toUpperCase());
			const bIndex = order.indexOf(b.region.toUpperCase());
			// eslint-disable-next-line no-nested-ternary
			return aIndex < bIndex ? -1 : aIndex > bIndex ? 1 : 0;
		}
		const aName = a.name.toUpperCase();
		const bName = b.name.toUpperCase();
		// eslint-disable-next-line no-nested-ternary
		return aName < bName ? -1 : aName > bName ? 1 : 0;
	});

	return transformed;
}

/**
 * Gets the filter key based on the value
 * @param {(Object|boolean|string)} value The filter value
 * @param {Object} valueMap The filter key to value map
 * @returns The key of the filter
 */
export function getFilterKeyFromValue(value, valueMap) {
	const isMinMax = typeof value === 'object'
		&& typeof value?.min !== 'undefined'
		&& typeof value?.max !== 'undefined';

	return Object.keys(valueMap).find(k => {
		const mapValue = valueMap[k];

		if (isMinMax) {
			return mapValue.min === value.min && mapValue.max === value.max;
		}

		return mapValue === value;
	});
}

/**
 * Gets an updated regions list to display in the filter with updated numLoansFundraising
 *
 * @param {Array<Object>} regions The regions previously displayed in the filter
 * @param {Array<Object>} nextRegions The regions returned by the latest FLSS facets query
 * @returns {Array<Object>} The updated regions list
 */
export function getUpdatedRegions(regions, nextRegions) {
	// Default to nextRegions
	if (!regions) return nextRegions;

	const updated = [];

	// Get updated numLoansFundraising
	regions.forEach(region => {
		const nextRegion = nextRegions.find(r => r.region === region.region);
		const nextRegionExists = !!nextRegion;
		const updatedRegion = {
			region: region.region,
			numLoansFundraising: nextRegionExists ? nextRegion.numLoansFundraising : 0,
			countries: []
		};

		updated.push(updatedRegion);

		region.countries.forEach(country => {
			const updatedCountry = { ...country };

			if (!nextRegionExists) {
				updatedCountry.numLoansFundraising = 0;
			} else {
				const nextCountry = nextRegion.countries.find(c => c.name === updatedCountry.name);
				updatedCountry.numLoansFundraising = nextCountry?.numLoansFundraising || 0;
			}

			updatedRegion.countries.push(updatedCountry);
		});
	});

	// Add missing regions that have been added since previous query
	nextRegions.forEach(region => {
		let updatedRegion = updated.find(r => r.region === region.region);

		if (!updatedRegion) {
			updatedRegion = {
				region: region.region,
				numLoansFundraising: region.numLoansFundraising,
				countries: []
			};
			updated.push(updatedRegion);
		}

		region.countries.forEach(country => {
			if (!updatedRegion.countries.find(c => c.name === country.name)) {
				updatedRegion.countries.push({ ...country });
			}
		});
	});

	return sortRegions(updated);
}

/**
 * Gets an updated items list to display in the filter with updated numLoansFundraising. Expected items and next format:
 * [{
 *   id: 1,
 *   name: '',
 *   numLoansFundraising: 1,
 * }]
 *
 * @param {Array<Object>} items The items previously displayed in the filter
 * @param {Array<Object>} next The items returned by the FLSS facets query
 * @returns {Array<Object>} The updated items list
 */
export function getUpdatedNumLoansFundraising(items, next) {
	const updated = [];

	// Get updated numLoansFundraising
	items?.forEach(item => {
		const nextItem = next.find(a => a.id === item.id);

		// Some facets don't have loan counts in FLSS
		const hasNumLoans = typeof item.numLoansFundraising !== 'undefined';

		const updatedItem = {
			...item,
			numLoansFundraising: hasNumLoans ? nextItem?.numLoansFundraising || 0 : undefined,
		};

		updated.push(updatedItem);
	});

	// Add missing items that have been added since previous query
	next?.forEach(item => {
		if (!updated.find(a => a.id === item.id)) {
			updated.push({ ...item });
		}
	});

	return _orderBy(updated, 'name');
}

/**
 * Returns the item label with fundraising amount in parens
 *
 * @param {Object} item The item for generating the label
 * @returns {string} The item label
 */
export function getCheckboxLabel(item) {
	const countLabel = typeof item.numLoansFundraising !== 'undefined' ? ` (${item.numLoansFundraising})` : '';

	return `${item.name || item.region}${countLabel}`;
}
