<template>
	<lend-button
		price="25"
		:loan-id="loanId"
		@add-to-basket="$emit('add-to-basket', $event)"
	>
		Lend again
	</lend-button>
</template>

<script>
import LendButton from './LendButton';

export default {
	name: 'LendAgainButton',
	components: {
		LendButton,
	},
	emits: ['add-to-basket'],
	props: {
		loanId: {
			type: Number,
			default: null
		},
	},
};
</script>
