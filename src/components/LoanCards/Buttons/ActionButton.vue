<template>
	<component
		:is="currentButtonState"
		class="action-button"
		:loan-id="loanId" />
</template>

<script>
import _includes from 'lodash/includes';
import Lend25Button from './Lend25Button';
import CheckoutNowButton from './CheckoutNowButton';
import LendAgainButton from './LendAgainButton';
import ReadMoreButton from './ReadMoreButton';

export default {
	props: {
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
	},
	computed: {
		currentButtonState() {
			if (_includes(this.itemsInBasket, this.loanId)) {
				return CheckoutNowButton;
			}
			if (this.isLentTo) {
				return LendAgainButton;
			}
			if (this.isFunded) {
				return ReadMoreButton;
			}
			return Lend25Button;
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.action-button {
	margin-top: rem-calc(30);
	margin-bottom: rem-calc(10);
	height: rem-calc(46);
	line-height: 1;
	font-size: rem-calc(20);
	width: 100%;

	@include breakpoint(medium) {
		line-height: rem-calc(15);
	}
}
</style>
