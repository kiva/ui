<template>
	<component
		:is="currentButtonState"
		class="action-button smaller"
		:loan-id="loanId"
		:loan="loan"
		:hide-adding-to-basket-text="hideAddingToBasketText"
		:minimal-checkout-button="minimalCheckoutButton"
		@add-to-basket="handleAddToBasketEvent"
	/>
</template>

<script>
import _includes from 'lodash/includes';
import addToBasketInsterstitial from '@/plugins/add-to-basket-show-interstitial';
import Lend25Button from './Lend25Button';
import LendIncrementButton from './LendIncrementButton';
import CheckoutNowButton from './CheckoutNowButton';
import LendAgainButton from './LendAgainButton';
import LoanFundedText from './LoanFundedText';
import LoanSelectedText from './LoanSelectedText';
import LoanExpiredText from './LoanExpiredText';

export default {
	mixins: [
		addToBasketInsterstitial
	],
	inject: ['apollo'],
	props: {
		loan: {
			type: Object,
			default: () => {}
		},
		loanId: {
			type: Number,
			default: null
		},
		itemsInBasket: {
			type: Array,
			default: () => []
		},
		isLentTo: {
			type: Boolean,
			default: false
		},
		isFunded: {
			type: Boolean,
			default: false
		},
		isSelectedByAnother: {
			type: Boolean,
			default: false
		},
		isExpired: {
			type: Boolean,
			default: false,
		},
		isSimpleLendButton: {
			type: Boolean,
			default: false
		},
		hideAddingToBasketText: {
			type: Boolean,
			default: false,
		},
		minimalCheckoutButton: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		currentButtonState() {
			if (this.isFunded) {
				return LoanFundedText;
			}
			if (this.isExpired) {
				return LoanExpiredText;
			}
			if (_includes(this.itemsInBasket, this.loanId)) {
				return CheckoutNowButton;
			}
			if (this.isLentTo) {
				return LendAgainButton;
			}
			if (this.isSelectedByAnother) {
				return LoanSelectedText;
			}

			return this.isSimpleLendButton ? Lend25Button : LendIncrementButton;
		},
	},
	methods: {
		handleAddToBasketEvent(payload) {
			this.$emit('add-to-basket', payload);
			if (payload.success) {
				this.triggerAddToBasketInterstitial(payload.loanId);
			}
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.action-button {
	margin-top: rem-calc(30);
	margin-bottom: rem-calc(10);
	width: 100%;
}
</style>
