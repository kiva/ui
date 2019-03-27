<template>
	<lend-button
		price="25"
		:loan-id="loanId"
		class="lend-again-button secondary"
		@click.native="triggerAddToBasketInterstitial(loanId)">
		Lend again
	</lend-button>
</template>

<script>
import addToBasketInsterstitial from '@/plugins/add-to-basket-show-interstitial';
import LendButton from './LendButton';

export default {
	mixins: [
		addToBasketInsterstitial
	],
	components: {
		LendButton,
	},
	props: {
		loanId: {
			type: Number,
			default: null
		},
	},
};
</script>
