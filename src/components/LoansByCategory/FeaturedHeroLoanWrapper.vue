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

import myRecommendations from '@/graphql/query/myRecommendations.graphql';
import featuredLoansQuery from '@/graphql/query/featuredLoansData.graphql';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';
import logReadQueryError from '@/util/logReadQueryError';

// DEFAULT category research-backed impact
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
		favoriteSectorId: {
			type: String,
			default: null
		},
		featuredSectorExpVersion: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			experimentData: {},
			featuredCategoryIds: [56],
			loan: null,
			loanChannel: null,
			loans: [],
			queryOffset: 0,
			fundedLoans: [],
			loading: false,
		};
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: myRecommendations
			}).then(({ data }) => {
				const topSectorId = _get(data, 'my.recommendations.topSectorId');
				return client.query({
					query: featuredLoansQuery,
					variables: {
						ids: featuredCategoryIds,
						numberOfLoans: initialLoanCount,
						sector: topSectorId ? [topSectorId] : null
					},
					fetchPolicy: 'network-only',
				});
			});
		},
	},
	created() {
		this.loading = true;

		// fetch cached query data
		let allLoanData = {};
		try {
			allLoanData = this.apollo.readQuery({
				query: featuredLoansQuery,
				variables: {
					ids: featuredCategoryIds,
					numberOfLoans: initialLoanCount,
					sector: this.favoriteSectorId ? [this.favoriteSectorId] : null,
				}
			});
		} catch (e) {
			logReadQueryError(e, 'FeatureHeroLoanWrapper featuredLoansQuery');
		}

		if (this.favoriteSectorId !== null && this.featuredSectorExpVersion === 'shown') {
			// set initial loan data so we ssr with a loan if possible
			const loanArray = _get(allLoanData, 'lend.loans.values');
			this.setInitialLoan(loanArray);
			// display custom channel data
			this.loanChannel = {
				id: 999,
				description: 'Some special text',
				name: 'Some special title',
			};
			this.featuredCategoryIds = [999];
		} else {
			// set initial loan data so we ssr with a loan if possible
			const loanChannelArray = _filter(
				_get(allLoanData, 'lend.loanChannelsById'),
				['id', featuredCategoryIds[0]]
			);
			this.loanChannel = _get(loanChannelArray, '[0]');
			this.setInitialLoan(_get(loanChannelArray, '[0].loans.values'));
		}
	},
	mounted() {
		// if we have no loans due to being funded, fetch some in the client
		if (this.loans && this.loans.length <= 0) {
			this.fetchMoreLoans();
		}

		if (this.featuredSectorExpVersion !== null) {
			// fire tracking for active exp here
			this.$kvTrackEvent(
				'Lending',
				'EXP-CASH-1113-Sept2019',
				this.featuredSectorExpVersion === 'shown' ? 'b' : 'a',
			);
		}
	},
	methods: {
		setInitialLoan(loanArray) {
			// accept original loans array
			// filter for funded
			this.loans = _filter(loanArray, loan => {
				return this.testFundedStatus(loan);
			});
			// get the first loan that is not funded
			if (this.loans.length > 0) {
				// eslint-disable-next-line prefer-destructuring
				this.loan = this.loans[0];
				this.loading = false;
			} else {
				// or just show initial loan on ssr even if funded
				this.loan = _get(loanArray, '[0]');
			}
		},
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
					ids: featuredCategoryIds,
					offset: this.queryOffset,
					sector: this.favoriteSectorId ? [this.favoriteSectorId] : null,
				}
			}).then(({ data }) => {
				if (this.favoriteSectorId !== null && this.featuredSectorExpVersion === 'shown') {
					this.loans = _get(data, 'lend.loans.values');
				} else {
					const loanArray = _filter(data.lend.loanChannelsById, ['id', featuredCategoryIds[0]]);
					this.loans = _get(
						loanArray,
						'[0].loans.values'
					);
				}

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
