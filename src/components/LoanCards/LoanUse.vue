<template>
	<p class="tw-line-clamp-4">
		{{ loanUse }}
	</p>
</template>

<script>
import numeral from 'numeral';

export default {
	name: 'LoanUse',
	props: {
		anonymizationLevel: {
			type: String,
			default: 'none',
		},
		use: {
			type: String,
			default: '',
		},
		loanAmount: {
			type: String,
			default: '',
		},
		status: {
			type: String,
			default: '',
		},
		borrowerCount: {
			type: Number,
			default: 1,
		},
		name: {
			type: String,
			default: '',
		},
		loanUseMaxLength: {
			type: Number,
			default: 100,
		},
	},
	computed: {
		helpLanguage() {
			if (this.status === 'fundraising' || this.status === 'inactive' || this.status === 'reviewed') {
				return 'helps';
			}
			return 'helped';
		},
		loanUse() {
			if (this.anonymizationLevel === 'full' || this.use.length === 0) {
				return 'For the borrower\'s privacy, this loan has been made anonymous.';
			}

			const isGroup = this.borrowerCount > 1;

			return `${numeral(this.loanAmount).format('$0,0')} `
				+ `${this.helpLanguage} `
				+ `${isGroup ? 'a member of ' : ''}`
				+ `${this.name} `
				+ `${this.use}`;
		},
	}
};
</script>
