<template>
	<www-page class="lend-filter-page" :gray-background="true">
		<lend-header />
		<div class="row page-content">
			<ais-instant-search
				v-if="searchClient"
				:search-client="searchClient"
				:index-name="algoliaIndex">
				<lend-filter-menu />
				<!-- eslint-disable vue/attribute-hyphenation -->
				<div class="small-12 columns">
					<ais-configure
						:hitsPerPage="12"
						:filters="defaultFilter" />
					<ais-current-refinements />
					<ais-hits
						class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3"
						:results-per-page="12">
						<template slot="default" slot-scope="{ items }">
							<algolia-adapter
								v-for="(item, itemIndex) in items" :key="itemIndex"
								:loan="item"
								:items-in-basket="itemsInBasket" />
						</template>
					</ais-hits>
					<algolia-pagination :padding="2" />
					<algolia-pagination-stats :padding="2" />
				</div>
				<!-- eslint-enable vue/attribute-hyphenation -->
			</ais-instant-search>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _map from 'lodash/map';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';
import WwwPage from '@/components/WwwFrame/WwwPage';
import LendHeader from '@/pages/Lend/LendHeader';

import itemsInBasketQuery from '@/graphql/query/basketItems.graphql';
import experimentSetting from '@/graphql/query/experimentSetting.graphql';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';

// Algolia Imports
import algoliasearch from 'algoliasearch/lite';
import {
	AisConfigure,
	AisInstantSearch,
	AisHits,
	AisCurrentRefinements,
} from 'vue-instantsearch';
import AlgoliaAdapter from '@/components/LoanCards/AlgoliaLoanCardAdapter';
import AlgoliaPagination from '@/pages/Lend/AlgoliaPagination';
import AlgoliaPaginationStats from '@/pages/Lend/AlgoliaPaginationStats';
import LendFilterMenu from '@/pages/Lend/LendFilter/LendFilterMenu';

export default {
	components: {
		LoadingOverlay,
		WwwPage,
		LendHeader,
		LendFilterMenu,
		AisConfigure,
		AisInstantSearch,
		AisHits,
		AisCurrentRefinements,
		AlgoliaAdapter,
		AlgoliaPagination,
		AlgoliaPaginationStats,
	},
	metaInfo: {
		title: 'Lend Filter'
	},
	created() {
		const itemsInBasketResults = this.apollo.readQuery({ query: itemsInBasketQuery });
		this.itemsInBasket = _map(_get(itemsInBasketResults, 'shop.basket.items.values'), 'id');
	},
	mounted() {
		// initialize searchClient + components on mount
		// TODO: update initialization once vue-instantsearch V2 supports SSR
		this.searchClient = algoliasearch(
			this.algoliaConfig.appId,
			this.algoliaConfig.apiKey
		);
	},
	data() {
		return {
			// These are required in each instance of the plugin
			algoliaAppId: this.algoliaConfig.appId,
			algoliaApiKey: this.algoliaConfig.apiKey,
			searchClient: null,
			// The index will likey be different based on context
			algoliaIndex: this.algoliaConfig.fundraisingIndex, // defaultIndex
			defaultSearch: 'Energy',
			// Focus in on fundraising Loans
			defaultFilter: '', // No Need with new fundraising index 'status:fundraising',
			itemsInBasket: null,
		};
	},
	inject: [
		'apollo',
		'algoliaConfig'
	],
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: itemsInBasketQuery,
			}).then(() => {
				// TODO: REMOVE Once CASH-103: Lend Increment Button EXP ENDS
				return client.query({ query: experimentSetting, variables: { key: 'uiexp.lend_increment_button' } });
			}).then(() => {
				// TODO: REMOVE Once CASH-103: Lend Increment Button EXP ENDS
				return client.query({ query: experimentQuery, variables: { id: 'lend_increment_button' } });
			});
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.lend-filter-page {
	.page-content {
		max-width: 63.75rem;
		padding: 0 1.5625rem;
	}
}
</style>
