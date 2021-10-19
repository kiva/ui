<template>
	<div class="featured-section-wrapper tw-bg-secondary">
		<div class="row">
			<div class="column small-12">
				<h2 class="section-name tw-mb-1">
					Featured: {{ loanChannel.name }}
				</h2>
				<p v-if="showCategoryDescription" class="show-for-large tw-mb-4">
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
			<kv-loading-overlay v-if="loading" id="updating-overlay" />
		</div>
	</div>
</template>

<script>
import _filter from 'lodash/filter';
import _get from 'lodash/get';
import gql from 'graphql-tag';

import featuredLoansQuery from '@/graphql/query/featuredLoansData.graphql';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import logReadQueryError from '@/util/logReadQueryError';
import { isLoanFundraising } from '@/util/loanUtils';

// Fallback featured_loan_channel id
const featuredCategoryIds = [98];
const initialLoanCount = 4;
const pageQuery = gql`query featuredLoanHero {
	general {
		uiConfigSetting(key: "featured_loan_channel") {
			key
			value
		}
	}
}`;

export default {
	components: {
		LoanCardController,
		KvLoadingOverlay,
	},
	inject: ['apollo', 'cookieStore'],
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
			experimentData: {},
			// Fallback featured_loan_channel id
			featuredCategoryIds: [98],
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
				query: pageQuery
			}).then(({ data }) => {
				// use setting based id if available
				const featuredChannelIdSetting = _get(data, 'general.uiConfigSetting.value');
				const featuredChannelId = featuredChannelIdSetting
					? [parseInt(featuredChannelIdSetting, 10)] : featuredCategoryIds;
				// query for featued loan channel
				return client.query({
					query: featuredLoansQuery,
					variables: {
						ids: featuredChannelId,
						numberOfLoans: initialLoanCount,
					},
					fetchPolicy: 'network-only',
				});
			});
		},
	},
	created() {
		this.loading = true;

		try {
			// get setting driven featured loan channel
			const featuredChannelIdSettingData = this.apollo.readQuery({
				query: pageQuery
			});
			// use setting based id if available
			const featuredChannelIdSetting = _get(featuredChannelIdSettingData, 'general.uiConfigSetting.value');
			if (featuredChannelIdSetting) {
				this.featuredCategoryIds = [parseInt(featuredChannelIdSetting, 10)];
			}
		} catch (e) {
			logReadQueryError(e, 'FeatureHeroLoanWrapper featureLoanChannelSetting');
		}

		// fetch cached query data
		let allLoanData = {};
		try {
			allLoanData = this.apollo.readQuery({
				query: featuredLoansQuery,
				variables: {
					ids: this.featuredCategoryIds,
					numberOfLoans: initialLoanCount,
				}
			});
		} catch (e) {
			logReadQueryError(e, 'FeatureHeroLoanWrapper featuredLoansQuery');
		}

		// set initial loan data so we ssr with a loan if possible
		const loanChannelArray = _filter(
			_get(allLoanData, 'lend.featuredLoanChannel'),
			['id', this.featuredCategoryIds[0]]
		);
		this.loanChannel = _get(loanChannelArray, '[0]');
		this.setInitialLoan(_get(loanChannelArray, '[0].loans.values'));
	},
	mounted() {
		// if we have no loans due to being funded, fetch some in the client
		if (this.loans && this.loans.length <= 0) {
			this.fetchMoreLoans();
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
				this.queryOffset += 4;
				this.fetchMoreLoans();
			} else {
				// fallback for 20 funded loans is to just show a funded loan
				this.loan = this.fundedLoans[this.fundedLoans.length - 1];
				this.loading = false;
			}
		},
		testFundedStatus(loan) {
			if (!isLoanFundraising(loan)) {
				this.fundedLoans.push(loan);
			}
			return isLoanFundraising(loan);
		},
		fetchMoreLoans() {
			this.apollo.query({
				query: featuredLoansQuery,
				variables: {
					ids: this.featuredCategoryIds,
					offset: this.queryOffset,
				}
			}).then(({ data }) => {
				const loanArray = _filter(data.lend.featuredLoanChannel, ['id', featuredCategoryIds[0]]);
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

	.section-description {
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
