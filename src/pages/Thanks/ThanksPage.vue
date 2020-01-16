<template>
	<www-page :gray-background="true">
		<div class="row page-content">
			<div class="small-12 columns thanks">
				<checkout-steps current-step="thanks" />

				<div class="thanks__header">
					<h1 class="thanks__header-h1">
						{{ lender.firstName }}, thanks to you, {{ loans.length }}
						{{ loans.length > 1 ? 'borrowers are' : 'borrower is' }} closer to their dreams!
					</h1>
					<p class="thanks__header-subhead">
						But the journey isn't over for them and many other borrowers.<br>
						Please tell your friends and multiply your impact
					</p>
				</div>

				<social-share
					class="thanks__social-share"
					:loans="loans"
				/>

				<div class="thanks__confirmation">
					<p>Confirmation sent to: {{ lender.email }}.</p>
					<button @click="toggleReceipt">
						<icon-receipt class="toggle-receipt-icon" />
						<span>{{ isReceiptVisible ? 'Hide' : 'Show' }} Receipt</span>
					</button>
				</div>

				<checkout-receipt
					class="thanks__receipt"
					v-if="isReceiptVisible"
					:lender="lender"
					:receipt="receipt"
				/>
			</div>
		</div>
	</www-page>
</template>

<script>
import confetti from 'canvas-confetti';

import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import CheckoutSteps from '@/components/Checkout/CheckoutSteps';
import IconReceipt from '@/assets/inline-svgs/icons/receipt.svg';
import SocialShare from '@/components/Checkout/SocialShare';
import WwwPage from '@/components/WwwFrame/WwwPage';
import checkoutReceiptQuery from '@/graphql/query/checkoutReceipt.graphql';

export default {
	components: {
		CheckoutReceipt,
		CheckoutSteps,
		IconReceipt,
		SocialShare,
		WwwPage,
	},
	inject: ['apollo'],
	metaInfo() {
		return {
			title: 'Thank you!'
		};
	},
	data() {
		return {
			lender: {},
			loans: [],
			receipt: {},
			isReceiptVisible: true,
		};
	},
	apollo: {
		query: checkoutReceiptQuery,
		preFetch: true,
		preFetchVariables({ route }) {
			return {
				checkoutId: route.query.kiva_transaction_id
			};
		},
		variables() {
			return {
				checkoutId: this.$route.query.kiva_transaction_id
			};
		},
		result({ data }) {
			this.lender = data.my.userAccount;
			this.receipt = data.shop.receipt;
			this.loans = data.shop.receipt.items.values
				.filter(item => item.basketItemType === 'loan_reservation')
				.map(item => item.loan);
		}
	},
	methods: {
		toggleReceipt() {
			this.isReceiptVisible = !this.isReceiptVisible;
		}
	},
	mounted() {
		confetti({
			origin: {
				y: 0.2
			},
			particleCount: 150,
			spread: 200,
			colors: ['#d74937', '#6859c0', '#fee259', '#118aec', '#DDFFF4', '#4faf4e', '#aee15c'] // misc. kiva colors
		});
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}

.thanks {
	&__header {
		text-align: center;
		margin-bottom: 3rem;
	}

	&__header-h1 {
		@include impact-text();
	}

	&__header-subhead {
		@include featured-text();
	}

	&__social-share {
		margin-bottom: 3rem;
	}

	&__confirmation {
		text-align: center;
		margin-bottom: 3rem;
	}

	&__receipt {
		max-width: rem-calc(485);
		margin: 0 auto;
	}
}

.toggle-receipt-icon {
	width: rem-calc(16);
}

</style>
