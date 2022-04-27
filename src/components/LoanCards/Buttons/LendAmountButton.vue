<template>
	<lend-button
		price="amountLeft"
		:loan-id="loanId"
		:is-partial-share="true"
		@add-to-basket="$emit('add-to-basket', $event)"
	>
		Lend ${{ amountLeft }}<span v-if="showNow"> now</span>
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
		loan: {
			type: Object,
			default: () => {}
		},
		showNow: {
			type: Boolean,
			default: false
		},
		amountLeft: {
			type: Number,
			default: 20
		}
	},
};
</script>
