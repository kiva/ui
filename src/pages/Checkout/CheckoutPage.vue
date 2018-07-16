<template>
	<www-page>
		<div class="row page-content">
			<div class="small-12 large-9 columns">
				<!-- <h1>Checkout</h1> -->
				<!-- checkout-steps -->
				<checkout-steps current-step="currentStep" @navigate-to-step="navigateToStep" />
				<!-- basket-page -->
				<!-- payment-page -->
				<!-- thanks-page -->
			</div>
		</div>
	</www-page>
</template>

<script>
// import lendingStatsQuery from '@/graphql/query/myLendingStats.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import CheckoutSteps from '@/pages/Checkout/CheckoutSteps';

export default {
	components: {
		WwwPage,
		CheckoutSteps
	},
	metaInfo: {
		title: 'Checkout'
	},
	data() {
		return {
			currentStep: 'basket'
		};
	},
	methods: {
		navigateToStep(step) {
			console.log(step);
			this.currentStep = step;
		}
	},
	// computed: {
	// 	currentStep() {
	// 		return 'basket';
	// 	}
	// }
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
