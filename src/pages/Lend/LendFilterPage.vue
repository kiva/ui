<template>
	<www-page class="lend-filter-page">
		<lend-header />
		<div class="row page-content">
			<div class="small-12 columns">
				<ais-instant-search
					v-if="searchClient"
					:search-client="searchClient"
					:index-name="algoliaIndex">
					<!-- eslint-disable vue/attribute-hyphenation -->
					<ais-configure
						:hitsPerPage="12"
						:filters="defaultFilter" />
					<ais-current-refinements />
					<ais-refinement-list :attribute="'sector.name'" />
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
					<ais-stats />
				</ais-instant-search>
			</div>
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
	AisRefinementList,
	AisStats,
} from 'vue-instantsearch';
import AlgoliaAdapter from '@/components/LoanCards/AlgoliaLoanCardAdapter';
import AlgoliaPagination from '@/pages/Lend/AlgoliaPagination';


export default {
	components: {
		LoadingOverlay,
		WwwPage,
		LendHeader,
		AisConfigure,
		AisInstantSearch,
		AisHits,
		AisCurrentRefinements,
		AisRefinementList,
		AisStats,
		AlgoliaAdapter,
		AlgoliaPagination,
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
			itemsInBasket: null
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
	main {
		background-color: $kiva-bg-lightgray;
	}
}
</style>
