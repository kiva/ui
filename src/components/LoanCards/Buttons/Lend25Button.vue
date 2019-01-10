<template>
	<lend-button price="25" :loan-id="loanId" class="lend-25-button" @lend="handleLend">
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
	},
	methods: {
		handleLend(amount) {
			this.$emit('lend', amount);
		},
	},
};
</script>
