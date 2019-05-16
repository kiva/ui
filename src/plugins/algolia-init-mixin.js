import _filter from 'lodash/filter';
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
	[
		{
			envName: 'dev',
			hostNameField: 'dev',
		},
		{
			envName: 'qa',
			hostNameField: 'qa',
		},
		{
			envName: 'prod',
			hostNameField: '',
		}
	].forEach(({ envName, hostNameField }) => {
		if (typeof window !== 'undefined' && window.location.host.includes(hostNameField)) {
			return `${envName}_fundraising_${selectedRouteSort[0].value}`;
		}
	});
	return '';
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
	return {
		query: uiState.query,
		gender:
			uiState.menu &&
			uiState.menu.gender,
		sector:
			uiState.refinementList &&
			uiState.refinementList['sector.name'] &&
			uiState.refinementList['sector.name'].join('~'),
		attributes:
			uiState.refinementList &&
			uiState.refinementList['loanThemeFilters.name'] &&
			uiState.refinementList['loanThemeFilters.name'].join('~'),
		tags:
			uiState.refinementList &&
			uiState.refinementList['tags.name'] &&
			uiState.refinementList['tags.name'].join('~'),
		location:
			uiState.hierarchicalMenu &&
			uiState.hierarchicalMenu['locationFacets.lvl0'] &&
			uiState.hierarchicalMenu['locationFacets.lvl0'].join('~'),
		repayment:
			uiState.range &&
			uiState.range.lenderRepaymentTerm,
		delinquency:
			uiState.range &&
			uiState.range['partner.delinquencyRate'],
		default:
			uiState.range &&
			uiState.range['partner.defaultRate'],
		risk:
			uiState.range &&
			uiState.range['partner.riskRating'],
		sortBy: createSimpleSortByFromState(uiState.sortBy),
		page: uiState.page
	};
}

function routeToState(routeState) {
	// console.log(`routeState: ${JSON.stringify(routeState)}`);
	return {
		query: routeState.query,
		menu: {
			gender: routeState.gender
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
			// These are required in each instance of the plugin
			algoliaAppId: this.algoliaConfig.appId,
			algoliaApiKey: this.algoliaConfig.apiKey,
			// environment + index config
			algoliaDefaultIndex: this.algoliaConfig.defaultIndex,
			algoliaGroup: this.algoliaConfig.group,
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
	},
};
