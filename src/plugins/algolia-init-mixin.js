import algoliasearch from 'algoliasearch/lite';
import { history as historyRouter } from 'instantsearch.js/es/lib/routers';
import { simple as simpleMapping } from 'instantsearch.js/es/lib/stateMappings';

export default {
	inject: [
		'algoliaConfig'
	],
	data() {
		return {
			routing: {
				router: historyRouter(),
				stateMapping: simpleMapping(),
			},
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
	}
};
