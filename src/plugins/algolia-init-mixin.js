import _filter from 'lodash/filter';
import _map from 'lodash/map';
import algoliasearch from 'algoliasearch/lite';
import { history as historyRouter } from 'instantsearch.js/es/lib/routers';

const indexKeys = [
	{ value: 'amount_desc', label: 'loanAmountDesc' },
	{ value: 'amount_asc', label: 'loanAmount' },
	{ value: 'loan_length', label: 'repaymentTerm' },
	{ value: 'amount_remaining', label: 'amountLeft' },
	{ value: 'expiring_soon', label: 'expiringSoon' },
	{ value: 'loans', label: 'newest' },
	{ value: 'popularity', label: 'popularity' },
];

// Rebuild index name as set in Algolia
function setSortByEnv(selectedRouteSort) {
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
function createSimpleSortByFromState(uiStateSortBy) {
	const defaultSort = 'popularity';
	const selectedSort = _filter(indexKeys, item => {
		if (uiStateSortBy !== undefined) {
			return uiStateSortBy.indexOf(item.value) !== -1;
		}
		return item.value === defaultSort;
	});
	return selectedSort[0].label;
}

// map simple sortBy string to algolia index name
function rebuildSortByIndexFromRoute(routeStateSortBy) {
	const defaultSort = 'popularity';
	const selectedRouteSort = _filter(indexKeys, item => {
		if (routeStateSortBy !== undefined) {
			return routeStateSortBy === item.label;
		}
		return item.label === defaultSort;
	});
	return setSortByEnv(selectedRouteSort);
}

function stateToRoute(uiState) {
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

function routeToState(routeState) {
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

const routing = {
	router: historyRouter(),
	stateMapping: {
		stateToRoute,
		routeToState
	}
};

export default {
	inject: [
		'algoliaConfig'
	],
	data() {
		return {
			routing,
			// Root searchClient Instance
			searchClient: null,
			// Utility instance of default index
			defaultIndexInstance: null,
			// These are required in each instance of the plugin
			algoliaAppId: this.algoliaConfig.appId,
			algoliaApiKey: this.algoliaConfig.apiKey,
			// environment + index config
			algoliaDefaultIndex: this.algoliaConfig.defaultIndex,
			algoliaGroup: this.algoliaConfig.group,
			// all locationFacets.lvl1 facet values
			locationLvl1: [],
			// all sector.name facet values
			allSectorNames: [],
			// all loanThemeFilters.name facet values
			allLoanThemeNames: [],
			// all tags.name facet values
			allTagNames: [],
		};
	},
	mounted() {
		// Initialize algolia anayltics library
		if (window.aa) {
			window.aa('init', {
				appId: this.algoliaAppId,
				apiKey: this.algoliaApiKey,
			});
		}
		// initialize searchClient + components on mount
		// TODO: update initialization once vue-instantsearch V2 supports SSR
		this.searchClient = algoliasearch(
			this.algoliaAppId,
			this.algoliaApiKey
		);

		// initialize utility instance of default index
		this.defaultIndexInstance = this.searchClient.initIndex(this.algoliaDefaultIndex);

		// set global data set for Lvl1 Locations
		this.setAllLvl1Locations();
		// set global data for Sectors aka. sector.names
		this.setAllSectors();
		// set global data for Attributes aka. loanThemeFilters.name
		this.setAllLoanthemeFilters();
		// set global data for Tags aka. tags.name
		this.setAllTags();
	},
	methods: {
		setAllLvl1Locations() {
			this.defaultIndexInstance.searchForFacetValues({
				facetName: 'locationFacets.lvl1',
				facetQuery: '*',
				maxFacetHits: 100,
			}, (err, data) => {
				if (err) throw err;
				if (data.facetHits) {
					this.locationLvl1 = _map(data.facetHits, facet => {
						return {
							count: 0,
							isRefined: false,
							highlighted: facet.highlighted,
							label: facet.value,
							value: facet.value,
						};
					});
				}
			});
		},
		setAllSectors() {
			this.defaultIndexInstance.searchForFacetValues({
				facetName: 'sector.name',
				facetQuery: '*',
				maxFacetHits: 100,
			}, (err, data) => {
				if (err) throw err;
				if (data.facetHits) {
					this.allSectorNames = _map(data.facetHits, facet => {
						return {
							count: 0,
							isRefined: false,
							highlighted: facet.highlighted,
							label: facet.value,
							value: facet.value,
						};
					});
				}
			});
		},
		setAllLoanthemeFilters() {
			this.defaultIndexInstance.searchForFacetValues({
				facetName: 'loanThemeFilters.name',
				facetQuery: '*',
				maxFacetHits: 100,
			}, (err, data) => {
				if (err) throw err;
				if (data.facetHits) {
					this.allLoanThemeNames = _map(data.facetHits, facet => {
						return {
							count: 0,
							isRefined: false,
							highlighted: facet.highlighted,
							label: facet.value,
							value: facet.value,
						};
					});
				}
			});
		},
		setAllTags() {
			this.defaultIndexInstance.searchForFacetValues({
				facetName: 'tags.name',
				facetQuery: '*',
				maxFacetHits: 100,
			}, (err, data) => {
				if (err) throw err;
				if (data.facetHits) {
					this.allTagNames = _map(data.facetHits, facet => {
						return {
							count: 0,
							isRefined: false,
							highlighted: facet.highlighted,
							label: facet.value,
							value: facet.value,
						};
					});
				}
			});
		},
	}
};
