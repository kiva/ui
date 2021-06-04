<template>
	<p class="text-h2">
		{{ loanUseFiltered }}
	</p>
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
		loanUseFiltered() {
			// eslint-disable-next-line max-len
			return loanUseFilter(this.use, this.name, this.status, this.loanAmount, this.borrowerCount, 100);
		},
	}
};

</script>
