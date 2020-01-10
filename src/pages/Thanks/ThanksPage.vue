<template>
	<www-page>
		<div class="row page-content">
			<div class="small-12 columns thanks" v-if="lender && loans && receipt">
				<div>
					<h1 class="thanks__header">
						{{ lender.firstName }}, thanks to you, {{ loans.length }}
						{{ loans.length > 1 ? 'borrowers are' : 'borrower is' }} closer to their dreams!
					</h1>
					<p class="thanks__subhead">
						But the journey isn't over for them and many other borrowers.<br>
						Please tell your friends and multiply your impact
					</p>
				</div>

				<social-share
					:loans="loans"
				/>

				<div>
					<p>Confirmation sent to: {{ lender.email }}.</p>
					<button @click="toggleReceipt">
						<icon-receipt class="toggle-receipt-icon" />
						<span>{{ isReceiptVisible ? 'Hide' : 'Show' }} Receipt</span>
					</button>
				</div>

				<checkout-receipt
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
import SocialShare from '@/components/Checkout/SocialShare';
import WwwPage from '@/components/WwwFrame/WwwPage';
import IconReceipt from '@/assets/inline-svgs/icons/receipt.svg';
import checkoutReceiptQuery from '@/graphql/query/checkoutReceipt.graphql';

export default {
	components: {
		CheckoutReceipt,
		IconReceipt,
		SocialShare,
		WwwPage,
	},
	inject: ['apollo'],
	data() {
		return {
			lender: null,
			loans: null,
			receipt: null,
			isReceiptVisible: true,
		};
	},
	apollo: {
		// TODO: Figure out why this doesn't work

		// query: checkoutReceiptQuery,
		// variables: {
		// 	checkoutId: 38646529, // TODO, how should this get passed in?
		// },
		// preFetch: true,
		// result({ data }) {
		// 	console.log(data);
		// 	// this.lender = data.my.userAccount;
		// 	// this.receipt = data.shop.receipt;
		// 	// this.loans = data.shop.receipt.items.values
		// 	// 	.filter(item => item.basketItemType === 'loan_reservation')
		// 	// 	.map(item => item.loan);
		// }
	},
	methods: {
		toggleReceipt() {
			this.isReceiptVisible = !this.isReceiptVisible;
		}
	},
	mounted() {
		// TEMP until can figure out why this doesn't work the normal way.
		this.apollo.query({
			query: checkoutReceiptQuery,
			variables: {
				checkoutId: 38646529,
			},
			fetchPolicy: 'no-cache', // TODO
		}).then(({ data }) => {
			console.log(data);
			this.lender = data.my.userAccount;
			this.receipt = data.shop.receipt;
			this.loans = data.shop.receipt.items.values
				.filter(item => item.basketItemType === 'loan_reservation')
				.map(item => item.loan);
		}).catch(error => {
			console.error(error);
		});
		// end TEMP

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
		@include impact-text();

		text-align: center;
	}
}

.toggle-receipt-icon {
	width: rem-calc(16);
}

</style>
