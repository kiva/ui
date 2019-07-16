import _map from 'lodash/map';
import algoliasearch from 'algoliasearch/lite';
import { history as historyRouter } from 'instantsearch.js/es/lib/routers';
import { stateToRoute, routeToState, fundraisingIndices } from '@/util/algoliaUtils';

// Algolia Routing initialization (passed into ais-instant-search component instance)
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
			allLocationsLvl1: [],
			// all sector.name facet values
			allSectorNames: [],
			// all loanThemeFilters.name facet values
			allLoanThemeNames: [],
			// all tags.name facet values
			allTagNames: [],
		};
	},
	computed: {
		// provide Updated index definitions based on environment config
		defaultSortIndices() {
			return fundraisingIndices.map(index => {
				return {
					value: this.algoliaGroup !== 'dev' ? index.value.replace('dev', this.algoliaGroup) : index.value,
					label: index.label
				};
			});
		},
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

		// ONLY Initialze all facet data for use on lend filter page
		if (this.$route.path === '/lend/filter') {
			// set global data set for Lvl1 Locations aka. locationFacets.lvl1
			this.setAllFacetValues('locationFacets.lvl1', 'allLocationsLvl1');
			// set global data for Sectors aka. sector.name
			this.setAllFacetValues('sector.name', 'allSectorNames');
			// set global data for Attributes aka. loanThemeFilters.name
			this.setAllFacetValues('loanThemeFilters.name', 'allLoanThemeNames');
			// set global data for Tags aka. tags.name
			this.setAllFacetValues('tags.name', 'allTagNames');
		}
	},
	methods: {
		// Fetch all facet values for a specific facet and merge them with the filtered facet values
		setAllFacetValues(facetName, facetDestinationKey) {
			this.defaultIndexInstance.searchForFacetValues({
				facetName,
				facetQuery: '*',
				maxFacetHits: 100,
			}, (err, data) => {
				if (err) throw err;
				if (data.facetHits) {
					this[facetDestinationKey] = _map(data.facetHits, facet => {
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
