<template>
	<div v-show="loanVisible" class="basket-item-wrapper row">
		<span class="small-3 medium-2 large-1">
			<checkout-item-img
				:loan-id="loan.id"
				:name="loan.loan.name"
				:image-url="loan.loan.image.url"
			/>
		</span>

		<span class="small-9 medium-7 large-9 borrower-info-wrapper">
			<span class="borrower-info featured-text">
				{{ loan.loan.name }} in {{ loan.loan.geocode.country.name }}
				<loan-matcher
					v-if="loan.loan.matchingText"
					:matching-text="loan.loan.matchingText"
				/>
				<loan-reservation
					:is-expiring-soon="loan.loan.loanFundraisingInfo.isExpiringSoon"
					:is-funded="loan.isFunded"
					:expiry-time="loan.expiryTime"
				/>
			</span>
		</span>
		<span class="small-3 show-for-small-only"></span>
		<span class="small-9 medium-3 large-2 loan-res-price-wrapper">
			<loan-price
				:price="loan.price"
				:loan-id="loan.id"
				:loan-amount="loan.loan.loanAmount"
				:funded-amount="loan.loan.loanFundraisingInfo.fundedAmount"
				:reserved-amount="loan.loan.loanFundraisingInfo.reservedAmount"
				@refreshtotals="onLoanUpdate($event)"
				@updating-totals="$emit('updating-totals', $event)"
			/>
		</span>
	</div>
</template>

<script>
import CheckoutItemImg from '@/components/Checkout/CheckoutItemImg';
import LoanMatcher from '@/components/Checkout/LoanMatcher';
import LoanReservation from '@/components/Checkout/LoanReservation';
import LoanPrice from '@/components/Checkout/LoanPrice';

export default {
	components: {
		CheckoutItemImg,
		LoanMatcher,
		LoanReservation,
		LoanPrice
	},
	props: {
		loan: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			loanVisible: true
		};
	},
	methods: {
		onLoanUpdate($event) {
			this.$emit('refreshtotals', $event);
			if ($event === 'removeLoan') {
				this.loanVisible = false;
			}
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.basket-item-wrapper {
	margin-bottom: rem-calc(30);
	padding-right: rem-calc(20);
}

.borrower-info-wrapper,
.loan-res-price-wrapper {
	padding-left: rem-calc(10);
}

.borrower-info {
	line-height: 0.8;
	font-weight: $global-weight-highlight;
}

</style>
