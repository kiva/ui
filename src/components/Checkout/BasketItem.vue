<template>
	<div class="basket-item-wrapper row">
		<span class="small-2">
			<checkout-item-img
				:loan-id="loan.id"
				:name="loan.loan.name"
				:image-url="loan.loan.image.url"
			/>
		</span>

		<span class="small-10 medium-6">
			<div class="borrower-info featured-text">
				{{ loan.loan.name }} in {{ loan.loan.geocode.country.name }}
				<loan-matcher
					v-if="loan.loan.matchingText"
					:matching-text="loan.loan.matchingText"
				/>
			</div>
		</span>

		<span class="small-12 medium-4">
			<loan-reservation
				:is-expiring-soon="loan.loan.loanFundraisingInfo.isExpiringSoon"
				:is-funded="loan.isFunded"
				:expiry-time="loan.expiryTime"
			/>
			<!-- Making this a component -->
			<input class="loan-price" type="select" :value="loan.price">
		</span>
	</div>
</template>

<script>
import CheckoutItemImg from '@/components/Checkout/CheckoutItemImg';
import LoanMatcher from '@/components/Checkout/LoanMatcher';
import LoanReservation from '@/components/Checkout/LoanReservation';

export default {
	components: {
		CheckoutItemImg,
		LoanMatcher,
		LoanReservation
	},
	props: {
		loan: {
			type: Object,
			default: () => {}
		},
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

</style>
