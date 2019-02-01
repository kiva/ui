<template>
	<div class="recent-loan-holder" :class="{ 'recent-loans-loaded': isLoaded, 'no-recent-loans': zeroRecentLoans }">
		<div v-if="showRecentlyViewed">
			<div v-if="isLoaded">
				<category-row
					class="loan-category-row"
					:key="recentlyViewedCategory.id"
					:loan-channel="recentlyViewedCategory"
					:items-in-basket="itemsInBasket"
					:row-number="-1"
					set-id="CASH-363-recently-viewed"
					:is-logged-in="isLoggedIn"
					:is-micro="isMicro"
				/>
			</div>
		</div>
		<loading-overlay v-if="!isLoaded && !zeroRecentLoans" id="updating-overlay" />
	</div>
</template>

<script>
import _get from 'lodash/get';
import WebStorage from 'store2';
import loansByIDQuery from '@/graphql/query/loansById.graphql';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';
import CategoryRow from '@/components/LoansByCategory/CategoryRow';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';

export default {
	components: {
		CategoryRow,
		LoadingOverlay
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
		isMicro: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			showRecentlyViewed: false,
			recentlyViewedLoans: [],
			recentlyViewedCategory: {
				id: 64,
				name: 'Recently viewed loans',
				url: '/lend/recently-viewed-loans', // required field
				loans: {
					values: [],
				},
			},
			isLoaded: false,
			zeroRecentLoans: false
		};
	},
	mounted() {
		// Read assignment for Recently Viewed Loans EXP Setup Recently Viewed Loans
		const recentlyViewedEXP = this.apollo.readQuery({
			query: experimentQuery,
			variables: { id: 'recently_viewed_loans' }
		});
		this.showRecentlyViewed = _get(recentlyViewedEXP, 'experiment.version') === 'variant-a';

		let recentLoanIds = [];
		// fetch recently viewed from localStorage (currently set in wwwApp on Borrower Profile)
		const recentlyViewed = WebStorage('recentlyViewedLoans');
		// decode, parse then set recently viewed loan data
		try {
			recentLoanIds = JSON.parse(atob(recentlyViewed));
		} catch (e) {
			// no-op
		}

		if (this.showRecentlyViewed) {
			if (recentLoanIds.length) {
				// query our custom loan set
				this.apollo.query({
					query: loansByIDQuery,
					variables: {
						ids: recentLoanIds,
						imgDefaultSize: 's150',
						imgRetinaSize: 's300'
					}
				}).then(({ data }) => {
					this.recentlyViewedCategory.loans.values = _get(data, 'lend.loans.values');
					// set our global id list + transition signifier
					this.recentlyViewedLoans = recentLoanIds;
					this.isLoaded = true;
				});
			} else {
				this.zeroRecentLoans = true;
			}
		} else {
			this.zeroRecentLoans = true;
		}
		// Track Assignment + Number of Loans
		// > Only fire if there are recent loans available to show.
		if (recentLoanIds.length) {
			this.$kvTrackEvent(
				'Lending',
				'EXP-CASH-348-Recently-Viewed-Loans',
				this.showRecentlyViewed ? 'b' : 'a',
				recentLoanIds.length
			);
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

// loading overlay overrides
#updating-overlay {
	background-color: $white;
	z-index: 500;
}

.recent-loan-holder {
	// Initial Height for Spinner
	min-height: 6rem;
	max-height: 6rem;
	-moz-transition: max-height 1s;
	transition: max-height 1s;
	overflow: hidden;
	display: block;
	position: relative;
	margin: 0 auto 2rem;
}

.recent-loans-loaded {
	// Total Height of Row is about 310px
	max-height: rem-calc(310);
}

.no-recent-loans {
	margin: 0;
	min-height: 0;
	max-height: 0;
}
</style>
