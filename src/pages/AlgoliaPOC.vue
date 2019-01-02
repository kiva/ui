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
						<ais-pagination :padding="2" />
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
// Import your specific Algolia Components here
// V2 Beta
// https://v2--vue-instantsearch.netlify.com/getting-started/using-components.html
import algoliasearch from 'algoliasearch/lite';
import {
	AisConfigure,
	AisInstantSearch,
	AisHits,
	AisPagination,
	AisCurrentRefinements,
	AisRefinementList,
} from 'vue-instantsearch';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import AlgoliaAdapter from '@/components/LoanCards/AlgoliaLoanCardAdapter';
import itemsInBasketQuery from '@/graphql/query/basketItems.graphql';

export default {
	components: {
		WwwPage,
		AisConfigure,
		AisInstantSearch,
		AisHits,
		AisPagination,
		AisCurrentRefinements,
		AisRefinementList,
		ActionButton,
		AlgoliaAdapter
	},
	metaInfo: {
		title: 'Algolia Search'
	},
	data() {
		return {
			// These are required in each instance of the plugin
			algoliaAppId: this.algoliaConfig.algoliaAppId,
			algoliaApiKey: this.algoliaConfig.algoliaApiKey,
			searchClient: null,
			// The index will likey be different based on context
			algoliaDefaultIndex: this.algoliaConfig.algoliaDefaultIndex,
			defaultSearch: 'Energy',
			// Focus in on fundRaising Loans
			defaultFilter: 'status:fundRaising',
			itemsInBasket: null
		};
	},
	inject: [
		'apollo',
		'algoliaConfig'
	],
	apollo: {
		query: itemsInBasketQuery,
		prefetch: true,
		result({ data }) {
			this.itemsInBasket = _map(_get(data, 'shop.basket.items.values'), 'id');
		}
	},
	mounted() {
		// initialize searchClient + components on mount
		// TODO: update initialization once vue-instantsearch V2 supports SSR
		this.searchClient = algoliasearch(
			this.algoliaConfig.algoliaAppId,
			this.algoliaConfig.algoliaApiKey
		);
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
