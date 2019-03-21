<template>
	<lend-button
		price="25"
		:loan-id="loanId"
		class="lend-25-button"
		@click.native="triggerAddToBasketInterstitial(loanId)">
		Lend $25
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
