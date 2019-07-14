import _filter from 'lodash/filter';
import _find from 'lodash/find';

// dev_fundraising_loans is the base index, all others are replicas
// INFO: This list powers the sort order component
export const fundraisingIndices = [
	{ value: 'dev_fundraising_amount_asc', label: 'Amount: low to high' },
	{ value: 'dev_fundraising_amount_desc', label: 'Amount: high to low' },
	{ value: 'dev_fundraising_amount_remaining', label: 'Amount left' },
	{ value: 'dev_fundraising_expiring_soon', label: 'Expiring soon' },
	{ value: 'dev_fundraising_loan_length', label: 'Loan length' },
	{ value: 'dev_fundraising_loans', label: 'Most Recent' },
	{ value: 'dev_fundraising_popularity', label: 'Trending Now' },
];

// Re-Map algolia index keys to legacy Kiva sort keys
export const sortIndexKeys = [
	{ value: 'amount_desc', label: 'loanAmountDesc' },
	{ value: 'amount_asc', label: 'loanAmount' },
	{ value: 'loan_length', label: 'repaymentTerm' },
	{ value: 'amount_remaining', label: 'amountLeft' },
	{ value: 'expiring_soon', label: 'expiringSoon' },
	{ value: 'loans', label: 'newest' },
	{ value: 'popularity', label: 'popularity' },
];

// provide Updated index definitions based on environment config
export function getDefaultSortIndices(algoliaGroup) {
	return fundraisingIndices.map(index => {
		return {
			value: algoliaGroup !== 'dev' ? index.value.replace('dev', algoliaGroup) : index.value,
			label: index.label
		};
	});
}

// Rebuild sort index name as set in Algolia
export function setSortByEnv(selectedRouteSort) {
	let envName;
	if (typeof window !== 'undefined') {
		if (window.location.host.includes('dev')) {
			envName = 'dev';
		} else if (window.location.host.includes('qa')) {
			envName = 'qa';
		} else if (window.location.host.includes('stage')) {
			envName = 'stage';
		} else {
			envName = 'prod';
		}
	}
	return `${envName}_fundraising_${selectedRouteSort[0].value}`;
}

// extract custom, simple name for sortBy value in url
export function createSimpleSortByFromState(uiStateSortBy) {
	const defaultSort = 'popularity';
	const selectedSort = _filter(sortIndexKeys, item => {
		if (uiStateSortBy !== undefined) {
			return uiStateSortBy.indexOf(item.value) !== -1;
		}
		return item.value === defaultSort;
	});
	return selectedSort[0].label;
}

// map simple sortBy string to algolia index name
export function rebuildSortByIndexFromRoute(routeStateSortBy) {
	const defaultSort = 'popularity';
	const selectedRouteSort = _filter(sortIndexKeys, item => {
		if (routeStateSortBy !== undefined) {
			return routeStateSortBy === item.label;
		}
		return item.label === defaultSort;
	});
	return setSortByEnv(selectedRouteSort);
}

// Build Algolia specific map of current search state to url query parameters
export function stateToRoute(uiState) {
	// console.log(`uiState: ${JSON.stringify(uiState)}`);
	/* eslint-disable no-mixed-operators no-alert */
	return {
		query: uiState.query,
		gender:
			uiState.menu
			&& uiState.menu.gender,
		sector:
			(uiState.refinementList
			&& uiState.refinementList['sector.name']
			&& uiState.refinementList['sector.name'].join('~'))
			|| (uiState.menu
			&& uiState.menu['sector.name']),
		attributes:
			uiState.refinementList
			&& uiState.refinementList['loanThemeFilters.name']
			&& uiState.refinementList['loanThemeFilters.name'].join('~'),
		tags:
			uiState.refinementList
			&& uiState.refinementList['tags.name']
			&& uiState.refinementList['tags.name'].join('~'),
		location:
			(uiState.hierarchicalMenu
			&& uiState.hierarchicalMenu['locationFacets.lvl0']
			&& uiState.hierarchicalMenu['locationFacets.lvl0'].join('~'))
			|| (uiState.menu
			&& uiState.menu['locationFacets.lvl0']),
		countries:
			uiState.refinementList
			&& uiState.refinementList['locationFacets.lvl1']
			&& uiState.refinementList['locationFacets.lvl1'].join('~'),
		repayment:
			uiState.range
			&& uiState.range.lenderRepaymentTerm,
		delinquency:
			uiState.range
			&& uiState.range['partner.delinquencyRate'],
		default:
			uiState.range
			&& uiState.range['partner.defaultRate'],
		risk:
			uiState.range
			&& uiState.range['partner.riskRating'],
		sortBy: createSimpleSortByFromState(uiState.sortBy),
		page: uiState.page
	};
}

// Build Algolia specific map from url query parameters into a search object
export function routeToState(routeState) {
	// console.log(`routeState: ${JSON.stringify(routeState)}`);
	return {
		query: routeState.query,
		menu: {
			gender: routeState.gender,
			'sector.name': routeState.sector,
			'locationFacets.lvl0': routeState.location,
		},
		refinementList: {
			'sector.name':
				routeState.sector
				&& routeState.sector.split('~'),
			'loanThemeFilters.name':
				routeState.attributes
				&& routeState.attributes.split('~'),
			'tags.name':
				routeState.tags
				&& routeState.tags.split('~'),
			'locationFacets.lvl1':
				routeState.countries
				&& routeState.countries.split('~'),
		},
		hierarchicalMenu: {
			'locationFacets.lvl0':
				routeState.location
				&& routeState.location.split('~'),
		},
		range: {
			lenderRepaymentTerm:
				routeState.repayment,
			'partner.delinquencyRate':
				routeState.delinquency,
			'partner.defaultRate':
				routeState.default,
			'partner.riskRating':
				routeState.risk,
		},
		sortBy: rebuildSortByIndexFromRoute(routeState.sortBy),
		page: routeState.page
	};
}

// Merge All facet values with filtered facet values (only keys with items in current search)
export default function mergeRefinmentListItems(allItems, filteredItems) {
	// new array to hold our merged items
	const patchedItems = [];
	allItems.forEach(originalItem => {
		// check filtered result items for matches
		const matchedItem = _find(filteredItems, item => {
			return item.value === originalItem.value;
		});
		if (matchedItem !== undefined) {
			// push matched/active item data
			patchedItems.push(matchedItem);
		} else {
			// push stub item data
			patchedItems.push(originalItem);
		}
	});
	return patchedItems;
}
