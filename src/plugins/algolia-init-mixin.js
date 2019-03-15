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
			// if (!routeState.q && routeState.brands === 'all' && routeState.p === 1) return baseUrl;
			if (!routeState.q && routeState.p === 1) return baseUrl;
			// end with a /
			if (baseUrl[baseUrl.length - 1] !== '/') baseUrl += '/';
			const routeStateArray = [];
			// search query
			if (routeState.q) {
				routeStateArray.push('q', encodeURIComponent(routeState.q));
			}
			// routeStateArray.push('q', encodeURIComponent(routeState.q) || null);
			// facet values
			if (routeState['sector.name']) {
				routeStateArray.push('sector', encodeURIComponent(routeState['sector.name']));
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
			// const routeStateValues = routeStateString.match(/^q\/(.*?)\/sector\/(.*?)\/p\/(.*?)$/);
			// console.log(`Parse URL routeStateValues: ${JSON.stringify(routeStateValues)}`);

			const urlState = {};
			const queryRx = /q\/(.*?)((\/.*$)|$)/;
			const sectorRx = /sector\/(.*?)((\/.*$)|$)/;
			const pageRx = /page\/(.*?)((\/.*$)|$)/;

			if (routeStateString.indexOf('q/') !== -1) {
				const queryMatch = routeStateString.match(queryRx);
				// console.log(queryMatch);
				const query = queryMatch[1];
				urlState.query = query;
			}

			if (routeStateString.indexOf('sector/') !== -1) {
				const sectorMatch = routeStateString.match(sectorRx);
				// console.log(sectorMatch);
				const sectorFacets = sectorMatch[1];
				urlState['sector.name'] = sectorFacets;
			}

			if (routeStateString.indexOf('page/') !== -1) {
				const pageMatch = routeStateString.match(pageRx);
				// console.log(pageMatch);
				const page = pageMatch[1];
				urlState.page = page;
			}

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
