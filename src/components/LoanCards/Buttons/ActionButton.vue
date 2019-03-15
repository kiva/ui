<template>
	<component
		:is="currentButtonState"
		class="action-button smaller"
		:loan-id="loanId"
		:loan="loan"
		:lend-increment-button-version="lendIncrementButtonVersion"
	/>
</template>

<script>
import _includes from 'lodash/includes';
import Lend25Button from './Lend25Button';
import LendIncrementButton from './LendIncrementButton';
import CheckoutNowButton from './CheckoutNowButton';
import LendAgainButton from './LendAgainButton';
import LoanFundedText from './LoanFundedText';
import LoanSelectedText from './LoanSelectedText';

export default {
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
		lendIncrementButtonVersion: {
			type: String,
			default: ''
		},
	},
	computed: {
		currentButtonState() {
			const experimentLendIncrement = (
				this.lendIncrementButtonVersion !== null ||
				this.lendIncrementButtonVersion !== 'variant-a'
			);
			if (_includes(this.itemsInBasket, this.loanId)) {
				return CheckoutNowButton;
			}
			if (this.isLentTo) {
				return LendAgainButton;
			}
			if (this.isFunded) {
				return LoanFundedText;
			}
			if (this.isSelectedByAnother) {
				return LoanSelectedText;
			}
			return experimentLendIncrement ? LendIncrementButton : Lend25Button;
		},
	},
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
