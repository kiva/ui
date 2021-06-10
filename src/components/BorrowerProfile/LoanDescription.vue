<template>
	<p class="tw-text-h2">
		{{ loanDescriptionFiltered }}
	</p>
</template>

<script>
const loanDescriptionFilter = require('../../plugins/loan-description-filter');

export default {
	props: {
		partnerName: {
			type: String,
			default: '',
		},
		moreInfoAboutLoan: {
			type: String,
			default: '',
		},
		moreAboutFieldPartner: {
			type: String,
			default: '',
		},
		dualStatementNote: {
			type: String,
			default: '',
		},
		directBusinessDescription: {
			type: String,
			default: '',
		},
		directLoanPurpose: {
			type: String,
			default: '',
		}
	},
	computed: {
		loanDescriptionFiltered() {
			// eslint-disable-next-line max-len
			return loanUseFilter(this.use, this.name, this.status, this.loanAmount, this.borrowerCount);
		},
	}
};

</script>
