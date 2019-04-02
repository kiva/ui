<template>
	<div class="featured-section-wrapper" v-if="loan">
		<div class="row">
			<div class="column small-12">
				<h2 class="section-name">Featured: Research-backed impact</h2>
				<p v-if="showCategoryDescription" class="section-description show-for-large">
					{{ loanChannel.description }}
				</p>
			</div>
		</div>
		<loan-card-controller
			:category-id="loanChannel.id"
			category-set-id="featured-hero-loan"
			:enable-tracking="true"
			:experiment-data="experimentData"
			:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
			:is-visitor="!isLoggedIn"
			:items-in-basket="itemsInBasket"
			:key="loan.id"
			:loan="loan"
			loan-card-type="FeaturedHeroLoan"
			:loan-channel="loanChannel"
			:position="1"
			:row-number="0"
		/>
	</div>
</template>

<script>
import _filter from 'lodash/filter';
import _get from 'lodash/get';

import featuredLoansQuery from '@/graphql/query/featuredLoansData.graphql';
import LoanCardController from '@/components/LoanCards/LoanCardController';

// research-backed impact category
const featuredCategoryIds = [56];

export default {
	components: {
		LoanCardController,
	},
	inject: ['apollo'],
	props: {
		featuredHeroLoanExperimentVersion: {
			type: String,
			default: ''
		},
		imageEnhancementExperimentVersion: {
			type: String,
			default: ''
		},
		isLoggedIn: {
			type: Boolean,
			default: false
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		showCategoryDescription: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			experimentData: null,
			featuredCategoryIds,
			loan: null,
			loanChannel: null,
		};
	},
	apollo: {
		query: featuredLoansQuery,
		preFetchVariables() {
			return {
				ids: featuredCategoryIds
			};
		},
		variables() {
			return {
				ids: this.featuredCategoryIds,
			};
		},
		preFetch(config, client) {
			return client.query({
				query: featuredLoansQuery,
				variables: {
					ids: featuredCategoryIds
				},
			});
		},
		result({ data }) {
			this.loan = _get(
				_filter(data.lend.loanChannelsById, ['id', this.featuredCategoryIds[0]]),
				'[0].loans.values[0]'
			);

			this.loanChannel = _get(
				_filter(data.lend.loanChannelsById, ['id', this.featuredCategoryIds[0]]),
				'[0]'
			);
		}
	},
	created() {
		this.experimentData = { featured_hero_loan_fundraising_thermometer: this.featuredHeroLoanExperimentVersion };
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

$row-max-width: 58.75rem;

.featured-section-wrapper {
	background-color: $kiva-bg-darkgray;
	margin: 0 auto 2rem;
	padding: 2rem 0;

	@include breakpoint(xxlarge down) {
		padding-left: rem-calc(40);
		padding-right: rem-calc(40);
	}

	.row {
		max-width: $row-max-width;

		.column {
			padding-left: 0;
		}
	}

	.section-name {
		font-weight: $global-weight-highlight;
		margin-bottom: rem-calc(8);
	}

	.section-description {
		@extend .section-name;

		font-weight: $global-weight-normal;
		margin-top: rem-calc(12);
		margin-bottom: rem-calc(20);
	}
}
</style>
