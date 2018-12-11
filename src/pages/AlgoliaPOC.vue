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
						<ais-search-box />
						<ais-results>
							<template slot-scope="{ result }">
								<!-- <GridLoanCard
									:key="result.id"
									:loan="result"
									:is-visitor="true"
									:items-in-basket="itemsInBasket"
								/> -->
								<div class="loan-card">
									<h2>
										<ais-highlight
											:result="result"
											attribute-name="name" />
										<small>({{ result.id }})</small>
									</h2>
									<h4>{{ amountLeft(result) }}</h4>
									<action-button
										class="smallest"
										:loan-id="result.id"
										:items-in-basket="itemsInBasket"
										:is-lent-to="false"
										:is-funded="result.status === 'funded' || amountLeft(result) <= 0" />
								</div>
							</template>
						</ais-results>
					</ais-index>
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
// import _get from 'lodash/get';
import WwwPage from '@/components/WwwFrame/WwwPage';
// Import your specific Algolia Components here
// V1 components are here: https://community.algolia.com/vue-instantsearch/getting-started/using-components.html
import { Index, SearchBox, Results, Highlight, Pagination } from 'vue-instantsearch';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
// We'll need to make an adapter/wrapper around our loan card components,
// this due to differences in the algolia loan object (kiva core loan) + loan as returned by graphql
// import GridLoanCard from '@/components/LoanCards/GridLoanCard';
// import itemsInBasketQuery from '@/graphql/query/basketItems.graphql';

export default {
	components: {
		WwwPage,
		// Declare them for use here, the key gets converted to lower kabab case for use in the html markup
		// -> To match their example code we add Ais before each component name
		AisIndex: Index,
		AisSearchBox: SearchBox,
		AisResults: Results,
		AisHighlight: Highlight,
		AisPagination: Pagination,
		ActionButton,
		// GridLoanCard,
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
			algoliaDefaultIndex: this.algoliaConfig.algoliaDefaultIndex,
			itemsInBasket: null
		};
	},
	inject: [
		'apollo',
		'algoliaConfig'
	],
	// apollo: {
	// 	query: itemsInBasketQuery,
	// 	prefetch: true,
	// 	result({ data }) {
	// 		console.log(data);
	// 	}
	// },
	methods: {
		amountLeft(loan) {
			const {
				fundedAmount,
				reservedAmount
			} = loan.loanFundraisingInfo;

			return loan.loanAmount.amount - fundedAmount.amount - reservedAmount.amount;
		}
	}
	// created() {
	// 	console.log(this.algoliaConfig);
	// },
	// mixins: [Component],
	// computed: {
	// 	query() {
	// 		return this.searchStore.query;
	// 	},
	// },
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}

.algolia-wrap {
	.ais-index {
		.ais-results {
			h2 {
				font-size: 1.2rem;
			}

			.ais-highlight {
				em {
					color: $kiva-green;
					text-decoration: underline;
					font-weight: 400;
				}
			}
		}
	}
}
</style>
