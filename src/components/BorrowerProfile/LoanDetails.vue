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
			:term="currencyLossScenarioTerm"
			:details="currencyLossScenarioDetails"
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
		currency: { // LoanTerm.currency
			type: String,
			default: '',
		},
		lossLiabilityCurrencyExchange: { // LoanTerm.lossLiabilityCurrencyExchange
			type: String,
			default: '',
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
		currencyLossScenarioTerm() {
			return this.isPartnerLoan ? 'Partner covers currency loss?' : 'Currency exchange loss:';
		},
		currencyLossScenarioDetails() {
			if (!this.isPartnerLoan) {
				return 'N/A';
			}

			if (this.currency === 'USD') {
				return 'N/A';
			}

			if (this.lossLiabilityCurrencyExchange === 'none') {
				return this.currency === 'USD' ? 'N/A' : 'Yes';
			}

			if (this.lossLiabilityCurrencyExchange === 'shared') {
				return 'Partially';
			}

			if (this.lossLiabilityCurrencyExchange === 'partner') {
				return 'Yes';
			}

			if (this.lossLiabilityCurrencyExchange === 'lender') {
				return 'No';
			}

			return '';
		},
	}
};

</script>
