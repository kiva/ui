<template>
	<transition name="kvexpand">
		<div class="recent-loan-holder" v-if="recentlyViewedLoans.length > 0">
			<category-row
				class="loan-category-row"
				:key="recentlyViewedCategory.id"
				:loan-channel="recentlyViewedCategory"
				:items-in-basket="itemsInBasket"
				:row-number="999"
				set-id="999"
				:is-logged-in="isLoggedIn"
			/>
		</div>
	</transition>
</template>

<script>
import _get from 'lodash/get';
import WebStorage from 'store2';
import loansByIDQuery from '@/graphql/query/loansById.graphql';
import CategoryRow from '@/components/LoansByCategory/CategoryRow';

export default {
	components: {
		CategoryRow
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
	},
	data() {
		return {
			recentlyViewedLoans: [],
			recentlyViewedCategory: {
				id: 999,
				name: 'Recently viewed loans',
				url: '/lend/recently-viewed-loans', // required field
				loans: {
					values: [],
				},
			}
		};
	},
	mounted() {
		// fetch recently viewed from localStorage (currently set in wwwApp on Borrower Profile)
		const recentlyViewed = WebStorage('recentlyViewedLoans');
		// decode, parse then set recently viewed loan data
		const recentLoanIds = JSON.parse(atob(recentlyViewed));
		// query our custom loan set
		this.apollo.query({
			query: loansByIDQuery,
			variables: {
				ids: recentLoanIds
			}
		}).then(({ data }) => {
			this.recentlyViewedCategory.loans.values = _get(data, 'lend.loans.values');

			// this.$nextTick(() => {
			// set our global id list + transition signifier
			this.recentlyViewedLoans = recentLoanIds;
			// });
		});
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kvexpand-enter-active,
.kvexpan-leave-active {
	transform: scaleY(1);
	transform-origin: top;
	transition: transform 0.7s ease;
	// transition: max-height 4s;
}

.kvexpand-enter,
.kvexpand-leave-to {
	// max-height: 0;
	transform: scaleY(0);
}

.recent-loan-holder {
	// overflow: hidden;
	// max-height: 690px;
	max-width: 1020px;
	margin: 0 auto;
}
</style>
