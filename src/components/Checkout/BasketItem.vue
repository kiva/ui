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
					v-if="loan.loan.matcherName"
					:matcher-name="loan.loan.matcherName"
				/>
				<!-- :is-anonymous="isAnonymous"
					:is-kiva-birthday="isKivaBirthday" -->

			</div>
		</span>

		<span class="small-12 medium-4">
			<!-- Making this a component -->
			<div class="reservation-info small-text">Reserved for ## more minutes</div>
			<!-- Making this a component -->
			<input class="loan-price" type="select">{{ loan.price }}
		</span>
	</div>
</template>

<script>
import CheckoutItemImg from '@/components/Checkout/CheckoutItemImg';
import LoanMatcher from '@/components/Checkout/LoanMatcher';

export default {
	components: {
		CheckoutItemImg,
		LoanMatcher
	},
	props: {
		loan: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			// matcherName: 'Anonymous'
		};
	},
	computed: {
		isAnonymous() {
			console.log('isAnonymous');
			return (this.matcherName === 'a Kiva supporter' || this.matcherName === 'Anonymous');
		},
		isKivaBirthday() {
			return this.matcherName === 'Kiva to celebrate our birthday!' || this.matcherName === 'Kiva birthday';
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.reservation-info {
	color: $kiva-text-light;
}

</style>
