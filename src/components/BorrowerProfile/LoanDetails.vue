<template>
	<dl>
		<loan-detail-item
			:term="'Loan length'"
			:details="loanLength"
		/>
		<loan-detail-item
			:term="'Repayment schedule'"
			:details="repaymentSchedule"
		/>
		<loan-detail-item
			:term="'Funding model'"
			:details="fundingModel"
		/>
		<loan-detail-item
			:term="'Partner covers currency loss?'"
			:details="hasCurrencyLossScenario"
		/>
		<loan-detail-item
			:term="'Is borrower paying interest?'"
			:details="borrowerPayingInterest"
		/>
	</dl>
</template>

<script>
import LoanDetailItem from '@/components/BorrowerProfile/LoanDetailItem';
export default {
	components: {
		LoanDetailItem,
	},
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
