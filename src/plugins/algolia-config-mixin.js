import algoliasearch from 'algoliasearch/lite';

export default {
	inject: [
		'algoliaConfig'
	],
	data() {
		return {
			// Root searchClient Instance
			searchClient: null,
			// These are required in each instance of the plugin
			algoliaAppId: this.algoliaConfig.appId,
			algoliaApiKey: this.algoliaConfig.apiKey,
			algoliaDefaultIndex: this.algoliaConfig.defaultIndex,
			algoliaGroup: this.algoliaConfig.group,
			fundraisingIndices: [
				{ value: 'dev_fundraising_amount_asc', label: 'Amount: low to high' },
				{ value: 'dev_fundraising_amount_desc', label: 'Amount: high to low' },
				{ value: 'dev_fundraising_amount_remaining', label: 'Amount left' },
				{ value: 'dev_fundraising_expiring_soon', label: 'Expiring soon' },
				{ value: 'dev_fundraising_loan_length', label: 'Loan length' },
				{ value: 'dev_fundraising_loans', label: 'Most Recent' },
				{ value: 'dev_fundraising_popularity', label: 'Trending Now' },
			]
		};
	},
	computed: {
		defaultSortIndices() {
			return this.fundraisingIndices.map(index => {
				return {
					value: this.algoliaApiKey !== 'dev' ? index.value.replace('dev', this.algoliaGroup) : index.value,
					label: index.label
				};
			});
		}
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
