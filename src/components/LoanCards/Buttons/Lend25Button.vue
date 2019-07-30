<template>
	<lend-button
		price="25"
		:loan-id="loanId"
		class="lend-25-button"
		:hide-adding-to-basket-text="hideAddingToBasketText"
		@add-to-basket="$emit('add-to-basket', $event)"
	>
		Lend $25
	</lend-button>
</template>

<script>
import LendButton from './LendButton';

export default {
	components: {
		LendButton,
	},
	props: {
		loanId: {
			type: Number,
			default: null
		},
		hideAddingToBasketText: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
