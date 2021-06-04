<template>
	<div>
		<span class="text-h2 text-gray-800">
			{{ filteredLoanUse }}
		</span>
	</div>
</template>

<script>
const loanUseFilter = require('../../plugins/loan-use-filter');

export default {
	props: {
		loanAmount: {
			type: String,
			default: '',
		},
		use: {
			type: String,
			default: '',
		},
		status: {
			type: String,
			default: '',
		},
		name: {
			type: String,
			default: '',
		},
		borrowerCount: {
			type: Number,
			default: 1,
		}
	},
	computed: {
		filteredLoanUse() {
			// eslint-disable-next-line max-len
			return loanUseFilter(this.use, this.name, this.status, this.loanAmount, this.borrowerCount, 100);
		},
	}
};

</script>
