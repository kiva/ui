import algoliasearch from 'algoliasearch/lite';
import { history as historyRouter } from 'instantsearch.js/es/lib/routers';
// import { simple as simpleMapping } from 'instantsearch.js/es/lib/stateMappings';

function stateToRoute(uiState) {
	console.log(`uiState: ${JSON.stringify(uiState)}`);
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
	console.log(`routeState: ${JSON.stringify(routeState)}`);
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
			console.log(`Create URL routeState: ${JSON.stringify(routeState)}`);
			console.log(`Create URL location: ${JSON.stringify(location)}`);
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
			console.log(`Parse URL location: ${JSON.stringify(location)}`);
			const routeStateString = location.href.split('/search/')[1];
			if (routeStateString === undefined) return {};
			console.log(`Parse URL routeStateString: ${JSON.stringify(routeStateString)}`);
			// const routeStateValues = routeStateString.match(/^q\/(.*?)\/sector\/(.*?)\/p\/(.*?)$/);
			// console.log(`Parse URL routeStateValues: ${JSON.stringify(routeStateValues)}`);

			const urlState = {};
			const queryRx = /q\/(.*?)((\/.*$)|$)/;
			const sectorRx = /sector\/(.*?)((\/.*$)|$)/;
			const themeRx = /theme\/(.*?)((\/.*$)|$)/;
			const tagsRx = /tags\/(.*?)((\/.*$)|$)/;
			const locRx = /location\/(.*?)((\/.*$)|$)/;
			const sortRx = /sortBy\/(.*?)((\/.*$)|$)/;
			const pageRx = /page\/(.*?)((\/.*$)|$)/;

			if (routeStateString.indexOf('q/') !== -1) {
				const queryMatch = routeStateString.match(queryRx);
				// console.log(queryMatch);
				const query = queryMatch[1];
				urlState.query = decodeURIComponent(query);
			}

			if (routeStateString.indexOf('sector/') !== -1) {
				const sectorMatch = routeStateString.match(sectorRx);
				// console.log(sectorMatch);
				const sectorFacets = sectorMatch[1];
				urlState['sector.name'] = decodeURIComponent(sectorFacets);
			}

			if (routeStateString.indexOf('theme/') !== -1) {
				const themeMatch = routeStateString.match(themeRx);
				// console.log(sectorMatch);
				const themeFacets = themeMatch[1];
				urlState['themeData.loanThemeTypeName'] = decodeURIComponent(themeFacets);
			}

			if (routeStateString.indexOf('tags/') !== -1) {
				const tagsMatch = routeStateString.match(tagsRx);
				// console.log(sectorMatch);
				const tagsFacets = tagsMatch[1];
				urlState['tags.name'] = decodeURIComponent(tagsFacets);
			}

			if (routeStateString.indexOf('location/') !== -1) {
				const locMatch = routeStateString.match(locRx);
				// console.log(sectorMatch);
				const locFacets = locMatch[1];
				urlState['locationFacets.lvl0'] = decodeURIComponent(locFacets);
			}

			if (routeStateString.indexOf('sortBy/') !== -1) {
				const sortMatch = routeStateString.match(sortRx);
				// console.log(pageMatch);
				const sort = sortMatch[1];
				urlState.sortBy = sort;
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
