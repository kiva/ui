<template>
	<lend-button
		price="25"
		:loan-id="loanId"
		class="lend-again-button secondary"
	>
		Lend again
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
	},
};
</script>
