<template>
	<www-page class="lend-filter-page" :gray-background="true">
		<lend-header />
		<div class="row page-content">
			<ais-instant-search
				v-if="searchClient"
				:search-client="searchClient"
				:index-name="algoliaDefaultIndex">
				<lend-filter-menu />
				<!-- eslint-disable vue/attribute-hyphenation -->
				<div class="small-12 columns">
					<ais-configure
						:hitsPerPage="12"
						:filters="defaultFilter" />
					<selected-refinements />
					<ais-hits
						class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3"
						:results-per-page="12">
						<template slot="default" slot-scope="{ items }">
							<algolia-adapter
								v-for="item in items" :key="item.id"
								:loan="item"
								:items-in-basket="itemsInBasket"
								:is-logged-in="isLoggedIn" />
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
import userStatus from '@/graphql/query/userId.graphql';
import experimentSetting from '@/graphql/query/experimentSetting.graphql';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';

// Algolia Imports
import algoliaConfig from '@/plugins/algolia-config-mixin';
import {
	AisConfigure,
	AisInstantSearch,
	AisHits,
} from 'vue-instantsearch';
import AlgoliaAdapter from '@/components/LoanCards/AlgoliaLoanCardAdapter';
import AlgoliaPagination from '@/pages/Lend/AlgoliaPagination';
import AlgoliaPaginationStats from '@/pages/Lend/AlgoliaPaginationStats';
import LendFilterMenu from '@/pages/Lend/Filter/LendFilterMenu';
import SelectedRefinements from '@/pages/Lend/Filter/SelectedRefinements';

export default {
	components: {
		SelectedRefinements,
		LoadingOverlay,
		WwwPage,
		LendHeader,
		LendFilterMenu,
		AisConfigure,
		AisInstantSearch,
		AisHits,
		AlgoliaAdapter,
		AlgoliaPagination,
		AlgoliaPaginationStats,
	},
	metaInfo: {
		title: 'Lend Filter'
	},
	mixins: [
		algoliaConfig
	],
	created() {
		// Set items in basket
		const itemsInBasketResults = this.apollo.readQuery({ query: itemsInBasketQuery });
		this.itemsInBasket = _map(_get(itemsInBasketResults, 'shop.basket.items.values'), 'id');
		// Set user status
		const userData = this.apollo.readQuery({ query: userStatus });
		this.isLoggedIn = _get(userData, 'my.userAccount.id') !== undefined || false;
	},
	data() {
		return {
			// Focus in on fundraising Loans
			defaultFilter: '', // Future to support loan channels, ex. 'status:fundraising',
			itemsInBasket: null,
			isLoggedIn: false
		};
	},
	inject: [
		'apollo',
	],
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: itemsInBasketQuery,
			}).then(() => {
				// Pre-fetch user Status
				return client.query({ query: userStatus });
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
