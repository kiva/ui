<template functional>
	<div class="small-text loan-length-warning-text">
		Loan term is longer than 36 months
	</div>
</template>

<script>
export default {
	props: {
		loanLengthText: {
			type: String,
			default: ''
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.loan-length-warning-text {
	line-height: 1rem;
	margin: rem-calc(10) 0;
}

</style>
