<template>
	<dl>
		<dt>Loan length</dt>
		<dd>{{ loanLength }}</dd>

		<dt>Repayment schedule</dt>
		<dd>{{ repaymentSchedule }}</dd>

		<dt>Funding model</dt>
		<dd>{{ fundingModel }}</dd>

		<dt>Partner covers currency loss?</dt>
		<dd>{{ hasCurrencyLossScenario }}</dd>

		<dt>Is borrower paying interest?</dt>
		<dd>{{ borrowerPayingInterest }}</dd>
	</dl>
</template>

<script>
export default {
	props: {
		partnerName: { // LoanPartner.partnerName
			type: String,
			default: '',
		},
		loanLenderRepaymentTerm: { // LoanBasic.lenderRepaymentTerm
			type: String,
			default: '',
		},
		loanTermLenderRepaymentTerm: { // LoanTerm.lenderRepaymentTerm
			type: String,
			default: '',
		},
		repaymentInterval: { // LoanBasic.repaymentInterval
			type: String,
			default: '',
		},
		flexibleFundraisingEnabled: { // LoanTerm.flexibleFundraisingEnabled
			type: Boolean,
			default: false,
		},
		chargesFeesInterest: { // Partner.chargesFeesInterest
			type: Boolean,
			default: false,
		},
	},
	computed: {
		isPartnerLoan() {
			return this.partnerName !== '';
		},
		loanLength() {
			return this.isPartnerLoan ? this.loanLenderRepaymentTerm : this.loanTermLenderRepaymentTerm;
		},
		repaymentSchedule() {
			return this.isPartnerLoan ? this.repaymentInterval : 'Monthly';
		},
		fundingModel() {
			return this.isPartnerLoan && this.flexibleFundraisingEnabled ? 'Flexible' : 'Fixed';
		},
		borrowerPayingInterest() {
			return this.isPartnerLoan && this.chargesFeesInterest ? 'Yes' : 'No';
		},
		hasCurrencyLossScenario() {
			return this.isPartnerLoan ? 'Yes' : 'No';
		},
	}
};

</script>
