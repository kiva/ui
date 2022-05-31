<template>
	<lend-button
		price="25"
		:loan-id="loanId"
		@add-to-basket="$emit('add-to-basket', $event)"
	>
		Lend $25
	</lend-button>
</template>

<script>
import LendButton from './LendButton';

export default {
	name: 'Lend25Button',
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
