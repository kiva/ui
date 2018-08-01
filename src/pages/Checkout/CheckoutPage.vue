<template>
	<www-page>
		<checkout-steps :current-step="currentStep" @navigate-to-step="navigateToStep" />
		<div class="row page-content">
			<div class="columns">
				<!-- basket-page / payment-page / thanks-page -->
				<component :is="checkoutComponent" />
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import CheckoutSteps from '@/pages/Checkout/CheckoutSteps';
import BasketSummary from '@/pages/Checkout/BasketSummary';
import PaymentSummary from '@/pages/Checkout/PaymentSummary';
import ThanksSummary from '@/pages/Checkout/ThanksSummary';

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
			this.currentStep = step;
		}
	},
	computed: {
		checkoutComponent() {
			if (this.currentStep === 'payment') {
				return PaymentSummary;
			}
			if (this.currentStep === 'thanks') {
				return ThanksSummary;
			}
			return BasketSummary;
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
