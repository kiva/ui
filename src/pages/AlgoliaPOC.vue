<template>
	<www-page>
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Algolia Search!</h1>

				<div class="algolia-wrap">
					<ais-instant-search
						v-if="searchClient"
						:search-client="searchClient"
						:index-name="algoliaDefaultIndex">
						<!-- eslint-disable vue/attribute-hyphenation -->
						<!-- We could run a default query... :query="defaultSearch" -->
						<ais-configure
							:hitsPerPage="12"
							:filters="defaultFilter" />
						<ais-current-refinements />
						<ais-refinement-list :attribute="'sector.name'" />
						<ais-breadcrumb
							:attributes="['locationFacets.lvl0', 'locationFacets.lvl1']" />
						<ais-hierarchical-menu
							:attributes="['locationFacets.lvl0', 'locationFacets.lvl1']"
							:limit="100" />
						<ais-sort-by :items="defaultSortIndices"/>
						<ais-hits
							class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3"
							:results-per-page="12">
							<template slot="default" slot-scope="{ items }">
								<algolia-adapter
									v-for="(item, itemIndex) in items" :key="itemIndex"
									:loan="item"
									:items-in-basket="itemsInBasket"
									:is-logged-in="isLoggedIn" />
							</template>
						</ais-hits>
						<ais-pagination :padding="2" />
						<ais-stats />
					</ais-instant-search>
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _map from 'lodash/map';
import WwwPage from '@/components/WwwFrame/WwwPage';
import algoliaConfig from '@/plugins/algolia-config-mixin';
// Import your specific Algolia Components here
// V2 Beta
// https://v2--vue-instantsearch.netlify.com/getting-started/using-components.html
// algolia search is always required, moved to mixin
// import algoliasearch from 'algoliasearch/lite';
import {
	AisConfigure,
	AisInstantSearch,
	AisHits,
	AisPagination,
	AisCurrentRefinements,
	AisRefinementList,
	AisHierarchicalMenu,
	AisBreadcrumb,
	AisStats,
	AisSortBy,
} from 'vue-instantsearch';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import AlgoliaAdapter from '@/components/LoanCards/AlgoliaLoanCardAdapter';
import itemsInBasketQuery from '@/graphql/query/basketItems.graphql';
import userStatus from '@/graphql/query/userId.graphql';
import experimentSetting from '@/graphql/query/experimentSetting.graphql';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';

export default {
	components: {
		WwwPage,
		AisConfigure,
		AisInstantSearch,
		AisHits,
		AisPagination,
		AisCurrentRefinements,
		AisRefinementList,
		AisHierarchicalMenu,
		AisBreadcrumb,
		AisStats,
		ActionButton,
		AlgoliaAdapter,
		AisSortBy
	},
	metaInfo: {
		title: 'Algolia Search'
	},
	data() {
		return {
			// Optional default search
			defaultSearch: 'Energy',
			// Optional default filter
			defaultFilter: '', // No Need with new fundraising index 'status:fundraising',
			itemsInBasket: null,
			isLoggedIn: false
		};
	},
	inject: [
		'apollo',
	],
	mixins: [
		algoliaConfig
	],
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: itemsInBasketQuery
			}).then(() => {
				// TODO: REMOVE Once Lend Increment Button EXP ENDS
				// Pre-fetch the setting for lend increment button
				return client.query({ query: userStatus });
			}).then(() => {
				// TODO: REMOVE Once Lend Increment Button EXP ENDS
				// Pre-fetch the setting for lend increment button
				return client.query({ query: experimentSetting, variables: { key: 'uiexp.lend_increment_button' } });
			}).then(() => {
				// TODO: REMOVE Once Lend Increment Button EXP ENDS
				// Pre-fetch the assigned version for lend increment button
				return client.query({ query: experimentQuery, variables: { id: 'lend_increment_button' } });
			});
		}
	},
	created() {
		const basketData = this.apollo.readQuery({
			query: itemsInBasketQuery
		});
		this.itemsInBasket = _map(_get(basketData, 'shop.basket.items.values'), 'id');

		const userData = this.apollo.readQuery({
			query: userStatus
		});
		this.isLoggedIn = _get(userData, 'my.userAccount.id') !== undefined || false;
	}
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}

.loan-card-group {
	position: relative;
}

.ais-Pagination-list {
	list-style: none;
	text-align: center;
	display: flex;
	margin: 0.75rem auto;
	justify-content: space-between;
	align-items: center;
	max-width: 17rem;

	.ais-Pagination-item {
		color: $kiva-text-light;
	}

	.ais-Pagination-item--active,
	.ais-Pagination-item--disabled {
		a {
			color: $kiva-text-light;
		}
	}

	.ais-Pagination-item--first,
	.ais-Pagination-item--previous,
	.ais-Pagination-item--next,
	.ais-Pagination-item--last {
		font-weight: bold;

		a:hover,
		a:visited {
			text-decoration: none;
		}
	}
}
</style>
