<template>
	<dl>
		<div class="tw-flex tw-mb-2">
			<dt class="tw-flex-1">
				<button class="tw-underline">Loan length</button>
			</dt>
			<dd>{{ loanLength }}</dd>
		</div>
		<div class="tw-flex tw-mb-2">
			<dt class="tw-flex-1">
				<button class="tw-underline">Repayment schedule</button>
			</dt>
			<dd>{{ repaymentSchedule }}</dd>
		</div>
		<div class="tw-flex tw-mb-2">
			<dt class="tw-flex-1">
				<button class="tw-underline">Funding model</button>
			</dt>
			<dd>{{ fundingModel }}</dd>
		</div>
		<div class="tw-flex tw-mb-2">
			<dt class="tw-flex-1">
				<button class="tw-underline">Partner covers currency loss?</button>
			</dt>
			<dd>{{ hasCurrencyLossScenario }}</dd>
		</div>
		<div class="tw-flex tw-mb-2">
			<dt class="tw-flex-1">
				<button class="tw-underline">Is borrower paying interest?</button>
			</dt>
			<dd>{{ borrowerPayingInterest }}</dd>
		</div>
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
