import algoliasearch from 'algoliasearch/lite';
import { history as historyRouter } from 'instantsearch.js/es/lib/routers';
// import { simple as simpleMapping } from 'instantsearch.js/es/lib/stateMappings';

function stateToRoute(uiState) {
	// console.log(`uiState: ${JSON.stringify(uiState)}`);
	return {
		query: uiState.query,
		'sector.name':
			uiState.refinementList &&
			uiState.refinementList['sector.name'] &&
			uiState.refinementList['sector.name'].join('~'),
		'themeData.loanThemeTypeName':
			uiState.refinementList &&
			uiState.refinementList['themeData.loanThemeTypeName'] &&
			uiState.refinementList['themeData.loanThemeTypeName'].join('~'),
		'tags.name':
			uiState.refinementList &&
			uiState.refinementList['tags.name'] &&
			uiState.refinementList['tags.name'].join('~'),
		'locationFacets.lvl0':
			uiState.hierarchicalMenu &&
			uiState.hierarchicalMenu['locationFacets.lvl0'] &&
			uiState.hierarchicalMenu['locationFacets.lvl0'].join('~'),
		sortBy: uiState.sortBy,
		page: uiState.page
	};
}

function routeToState(routeState) {
	// console.log(`routeState: ${JSON.stringify(routeState)}`);
	return {
		query: routeState.query,
		refinementList: {
			'sector.name':
				routeState['sector.name']
				&& routeState['sector.name'].split('~'),
			'themeData.loanThemeTypeName':
				routeState['themeData.loanThemeTypeName']
				&& routeState['themeData.loanThemeTypeName'].split('~'),
			'tags.name':
				routeState['tags.name']
				&& routeState['tags.name'].split('~'),
		},
		hierarchicalMenu: {
			'locationFacets.lvl0':
				routeState['locationFacets.lvl0']
				&& routeState['locationFacets.lvl0'].split('~'),
		},
		sortBy: routeState.sortBy,
		page: routeState.page
	};
}

function historyRouting() {
	return historyRouter({
		/*
			We can spec and extend how the title is re-written
		*/
		// windowTitle(routeState) {
		// 	console.log(`window Title routeState: ${JSON.stringify(routeState)}`);
		// 	return `Kiva | Filter Loans by: ${routeState.q}`;
		// },
		/*
			Customize our how the url is written
			> This will allow us to simplify our existing key values
			> For instance we could convert sector.name to sector
		*/
		createURL({ routeState, location }) {
			// console.log(`Create URL routeState: ${JSON.stringify(routeState)}`);
			// console.log(`Create URL location: ${JSON.stringify(location)}`);
			// establish base url
			let baseUrl = location.href.split('/search/')[0];
			// preserve base url if no search is set
			if (!routeState.q && routeState.p === 1) return baseUrl;
			// end with a /
			if (baseUrl[baseUrl.length - 1] !== '/') baseUrl += '/';
			const routeStateArray = [];
			// TODO: We should probably run these through an addition process to:
			// > convert spaces to -
			// > remove # marks from tags
			// > We then have to reverse the process when parsing the url below
			// search query
			if (routeState.q) {
				routeStateArray.push('q', encodeURIComponent(routeState.q));
			}
			// facet values
			if (routeState['sector.name']) {
				routeStateArray.push('sector', encodeURIComponent(routeState['sector.name']));
			}
			if (routeState['themeData.loanThemeTypeName']) {
				routeStateArray.push('theme', encodeURIComponent(routeState['themeData.loanThemeTypeName']));
			}
			if (routeState['tags.name']) {
				routeStateArray.push('tags', encodeURIComponent(routeState['tags.name']));
			}
			// hierarchical values
			if (routeState['locationFacets.lvl0']) {
				routeStateArray.push('location', encodeURIComponent(routeState['locationFacets.lvl0']));
			}
			// sortBy
			if (routeState.sortBy !== 'undefined') {
				// TODO: create map of sort types with short names instead of index names
				routeStateArray.push('sortBy', routeState.sortBy);
			}
			// page number
			if (routeState.page !== 'undefined') {
				routeStateArray.push('page', routeState.page);
			}

			if (routeStateArray.length) {
				return `${baseUrl}search/${routeStateArray.join('/')}`;
			}

			return `${baseUrl}search/`;
		},
		/*
			Handle parsing our custom url
			> This will allow us to convert urls (maybe even legacy urls) to match our algolia data structure
			> For example, sector=housing would become sector.name=housing
			> We could potentially also convert sector=9 to sector.name=housing to handle legacy urls
			> > This would require us to create a map of values to ids
		*/
		parseURL({ location }) {
			// console.log(`Parse URL location: ${JSON.stringify(location)}`);
			const routeStateString = location.href.split('/search/')[1];
			if (routeStateString === undefined) return {};
			// console.log(`Parse URL routeStateString: ${JSON.stringify(routeStateString)}`);

			const urlState = {};

			const facetTransformations = [
				{
					segment: 'q/',
					rx: /q\/(.*?)((\/.*$)|$)/,
					stateKey: 'query'
				},
				{
					segment: 'sector/',
					rx: /sector\/(.*?)((\/.*$)|$)/,
					stateKey: 'sector.name'
				},
				{
					segment: 'theme/',
					rx: /theme\/(.*?)((\/.*$)|$)/,
					stateKey: 'themeData.loanThemeTypeName'
				},
				{
					segment: 'tags/',
					rx: /tags\/(.*?)((\/.*$)|$)/,
					stateKey: 'tags.name'
				},
				{
					segment: 'location/',
					rx: /location\/(.*?)((\/.*$)|$)/,
					stateKey: 'locationFacets.lvl0'
				},
				{
					segment: 'sortBy/',
					rx: /sortBy\/(.*?)((\/.*$)|$)/,
					stateKey: 'sortBy'
				},
				{
					segment: 'page/',
					rx: /page\/(.*?)((\/.*$)|$)/,
					stateKey: 'page'
				},
			];

			function setUrlState(facet) {
				if (routeStateString.indexOf(facet.segment) !== -1) {
					const facetMatch = routeStateString.match(facet.rx);
					// console.log(facetMatch);
					const segment = facetMatch[1];
					// console.log(segment)
					urlState[facet.stateKey] = decodeURIComponent(segment);
					// console.log(`parsing urlState: ${JSON.stringify(urlState)}`);
					return true;
				}
				return false;
			}

			facetTransformations.forEach(facet => {
				setUrlState(facet);
			});

			return urlState;
		},
	});
}

const routing = {
	router: historyRouting(),
	// stateMapping: simpleMapping(),
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
			// routing: {
			// 	router: historyRouter(),
			// 	stateMapping: simpleMapping(),
			// },
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
		// initialize searchClient + components on mount
		// TODO: update initialization once vue-instantsearch V2 supports SSR
		this.searchClient = algoliasearch(
			this.algoliaAppId,
			this.algoliaApiKey
		);
	},
};
