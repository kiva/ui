<template>
	<div class="featured-section-wrapper">
		<div class="row">
			<div class="column small-12">
				<h2 class="section-name">
					Featured: Research-backed impact
				</h2>
				<p v-if="showCategoryDescription" class="section-description show-for-large">
					{{ loanChannel.description }}
				</p>
			</div>
		</div>
		<div class="featured-loan-card-row">
			<loan-card-controller
				v-if="loan"
				:category-id="loanChannel.id"
				category-set-id="featured-hero-loan"
				:enable-tracking="true"
				:experiment-data="experimentData"
				:is-visitor="!isLoggedIn"
				:items-in-basket="itemsInBasket"
				:key="loan.id"
				:loan="loan"
				loan-card-type="FeaturedHeroLoan"
				:loan-channel="loanChannel"
				:position="1"
				:row-number="0"
			/>
			<loading-overlay v-if="loading" id="updating-overlay" />
		</div>
	</div>
</template>

<script>
import _filter from 'lodash/filter';
import _get from 'lodash/get';
import numeral from 'numeral';

import featuredLoansQuery from '@/graphql/query/featuredLoansData.graphql';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';
import cookieStore from '@/util/cookieStore';
import logReadQueryError from '@/util/logReadQueryError';

// research-backed impact category
const featuredCategoryIds = [56];
const initialLoanCount = 4;

export default {
	components: {
		LoanCardController,
		LoadingOverlay,
	},
	inject: ['apollo'],
	props: {
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
			experimentData: () => {},
			featuredCategoryIds,
			initialLoanCount,
			loan: null,
			loanChannel: null,
			loans: [],
			queryOffset: 0,
			fundedLoans: [],
			loading: false,
		};
	},
	apollo: {
		query: featuredLoansQuery,
		preFetchVariables() {
			return {
				ids: featuredCategoryIds,
				numberOfLoans: initialLoanCount,
			};
		},
		variables() {
			return {
				ids: this.featuredCategoryIds,
				numberOfLoans: this.initialLoanCount,
			};
		},
		preFetch(config, client) {
			return client.query({
				query: featuredLoansQuery,
				variables: {
					ids: featuredCategoryIds,
					numberOfLoans: initialLoanCount,
				},
				fetchPolicy: 'network-only',
			});
		},
	},
	created() {
		this.loading = true;

		// get initial loan data
		let rawData = {};
		try {
			rawData = this.apollo.readQuery({
				query: featuredLoansQuery,
				variables: {
					ids: this.featuredCategoryIds,
					numberOfLoans: this.initialLoanCount,
					basketId: cookieStore.get('kvbskt'),
				},
			});
		} catch (e) {
			logReadQueryError(e);
		}

		// set initial loan data so we ssr with a loan if possible
		const loanArray = _filter(_get(rawData, 'lend.loanChannelsById'), ['id', this.featuredCategoryIds[0]]);
		this.loanChannel = _get(loanArray, '[0]');
		// remove loans that are funded
		this.loans = _filter(_get(loanArray, '[0].loans.values'), loan => {
			return this.testFundedStatus(loan);
		});
		// get the first loan that is not funded
		if (this.loans.length > 0) {
			// eslint-disable-next-line prefer-destructuring
			this.loan = this.loans[0];
			this.loading = false;
		} else {
			// show the funded loan on ssr
			this.loan = _get(loanArray, '[0].loans.values[0]');
		}
	},
	mounted() {
		// if we have no loans due to being funded, fetch some in the client
		if (this.loans && this.loans.length <= 0) {
			this.fetchMoreLoans();
		}
	},
	methods: {
		filterFundedLoans() {
			// remove loans that are funded
			this.loans = _filter(this.loans, loan => {
				return this.testFundedStatus(loan);
			});
			// get the first loan that is not funded
			if (this.loans.length > 0) {
				// eslint-disable-next-line prefer-destructuring
				this.loan = this.loans[0];
				this.loading = false;
			} else if (this.queryOffset <= 20) {
				// allow up to 4 extra queries to get eligible loans
				this.queryOffset = this.queryOffset + 4;
				this.fetchMoreLoans();
			} else {
				// fallback for 20 funded loans is to just show a funded loan
				this.loan = this.fundedLoans[this.fundedLoans.length - 1];
				this.loading = false;
			}
		},
		testFundedStatus(loan) {
			// check status, store if funded
			if (_get(loan, 'status') !== 'fundraising') {
				this.fundedLoans.push(loan);
				return false;
			}
			// check fundraising information, store if funded
			const loanAmount = numeral(_get(loan, 'loanAmount'));
			const fundedAmount = numeral(_get(loan, 'loanFundraisingInfo.fundedAmount'));
			const reservedAmount = numeral(_get(loan, 'loanFundraisingInfo.reservedAmount'));
			// loan amount vs funded amount
			if (loanAmount.value() === fundedAmount.value()) {
				this.fundedLoans.push(loan);
				return false;
			}
			// loan amount vs funded + reserved amount
			if (loanAmount.value() === (fundedAmount.value() + reservedAmount.value())) {
				this.fundedLoans.push(loan);
				return false;
			}
			// all clear
			return true;
		},
		fetchMoreLoans() {
			this.apollo.query({
				query: featuredLoansQuery,
				variables: {
					ids: this.featuredCategoryIds,
					offset: this.queryOffset,
				}
			}).then(({ data }) => {
				const loanArray = _filter(data.lend.loanChannelsById, ['id', this.featuredCategoryIds[0]]);
				this.loans = _get(
					loanArray,
					'[0].loans.values'
				);

				this.filterFundedLoans();
			});
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

$row-max-width: 58.75rem;

.featured-section-wrapper {
	position: relative;
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

	.featured-loan-card-row {
		position: relative;
		min-height: rem-calc(400);
	}
	// loading overlay overrides
	#updating-overlay {
		background-color: rgba($kiva-bg-darkgray, 0.7);
		z-index: 500;
		display: flex;
		align-items: center;
		justify-content: center;

		.spinner-wrapper {
			position: relative;
			left: auto;
			transform: none;
		}
	}
}
</style>
