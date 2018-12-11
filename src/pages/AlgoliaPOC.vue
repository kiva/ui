<template>
	<www-page>
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Algolia Search!</h1>

				<div class="algolia-wrap">
					<ais-index
						v-if="algoliaAppId"
						:app-id="algoliaAppId"
						:api-key="algoliaApiKey"
						:index-name="algoliaDefaultIndex">
						<!-- <ais-search-box
							placeholder="Find loans..." /> -->
						<ais-input
							placeholder="Find loans..."
							:value="defaultSearch"
							autofocus />
						<ais-results
							class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3"
							:results-per-page="12">
							<template slot-scope="{ result }">
								<algolia-adapter
									:loan="result"
									:items-in-basket="itemsInBasket" />
							</template>
						</ais-results>
						<ais-pagination :padding="2" />
					</ais-index>
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
// V1 components are here: https://community.algolia.com/vue-instantsearch/getting-started/using-components.html
import { Index, SearchBox, Input, Results, Highlight, Pagination } from 'vue-instantsearch';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import AlgoliaAdapter from '@/components/LoanCards/AlgoliaLoanCardAdapter';
import itemsInBasketQuery from '@/graphql/query/basketItems.graphql';

export default {
	components: {
		WwwPage,
		// Declare them for use here, the key gets converted to lower kabab case for use in the html markup
		// -> To match their example code we add Ais before each component name
		AisIndex: Index,
		AisSearchBox: SearchBox,
		AisInput: Input,
		AisResults: Results,
		AisHighlight: Highlight,
		AisPagination: Pagination,
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
			// The index will likey be different based on context
			algoliaDefaultIndex: 'dev_funding',
			defaultSearch: 'Energy',
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

.ais-pagination {
	list-style: none;
	text-align: center;
	display: flex;
	margin: 0.75rem auto;
	justify-content: space-between;
	align-items: center;
	max-width: 17rem;

	.ais-pagination__item {
		color: $kiva-text-light;
	}

	.ais-pagination__item--active,
	.ais-pagination__item--disabled {
		a {
			color: $kiva-text-light;
		}
	}

	.ais-pagination__item--first,
	.ais-pagination__item--previous,
	.ais-pagination__item--next,
	.ais-pagination__item--last {
		font-weight: bold;

		a:hover,
		a:visited {
			text-decoration: none;
		}
	}
}
</style>
