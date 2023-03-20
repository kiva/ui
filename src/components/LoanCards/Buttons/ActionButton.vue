<template>
	<component
		:is="currentButtonState"
		:disable-redirects="disableRedirects"
		:loan-id="loanId"
		:loan="loan"
		:minimal-checkout-button="minimalCheckoutButton"
		@add-to-basket="handleAddToBasketEvent"
		:show-now="showNow"
		:amount-left="amountLeft"
		:enable-five-dollars-notes="enableFiveDollarsNotes"
	/>
</template>

<script>
import _includes from 'lodash/includes';
import addToBasketInsterstitial from '@/plugins/add-to-basket-show-interstitial';
import LendAmountButton from './LendAmountButton';
import Lend25Button from './Lend25Button';
import LendIncrementButton from './LendIncrementButton';
import CheckoutNowButton from './CheckoutNowButton';
import LendAgainButton from './LendAgainButton';
import LoanFundedText from './LoanFundedText';
import LoanSelectedText from './LoanSelectedText';
import LoanExpiredText from './LoanExpiredText';

export default {
	name: 'ActionButton',
	mixins: [
		addToBasketInsterstitial
	],
	inject: ['apollo'],
	props: {
		disableRedirects: {
			type: Boolean,
			default: false,
		},
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
		isAmountLendButton: {
			type: Boolean,
			default: false
		},
		minimalCheckoutButton: {
			type: Boolean,
			default: false,
		},
		showNow: {
			type: Boolean,
			default: false
		},
		amountLeft: {
			type: Number,
			default: 0,
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {};
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
			if (this.isAmountLendButton) return LendAmountButton;
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
