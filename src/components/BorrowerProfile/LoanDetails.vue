<template>
	<dl>
		<description-list-item
			:term="'Loan length'"
			:details="`${loanLength} months`"
		/>
		<description-list-item
			:term="'Repayment schedule'"
			:details="repaymentSchedule"
		/>
		<description-list-item
			:term="'Funding model'"
			:details="fundingModel"
		/>
		<description-list-item
			:term="currencyLossScenarioTerm"
			:details="currencyLossScenarioDetails"
		/>
		<description-list-item
			:term="'Is borrower paying interest?'"
			:details="borrowerPayingInterest"
		/>
	</dl>
</template>

<script>
import DescriptionListItem from '@/components/BorrowerProfile/DescriptionListItem';

export default {
	components: {
		DescriptionListItem,
	},
	props: {
		partnerName: { // LoanPartner.partnerName
			type: String,
			default: '',
		},
		loanLenderRepaymentTerm: { // LoanBasic.lenderRepaymentTerm
			type: Number,
			default: 0,
		},
		loanTermLenderRepaymentTerm: { // LoanTerm.lenderRepaymentTerm
			type: Number,
			default: 0,
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
			const schedule = this.isPartnerLoan ? this.repaymentInterval : 'Monthly';
			const scheduleUpperCase = schedule.toString().charAt(0).toUpperCase() + schedule.toString().slice(1);
			return scheduleUpperCase;
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
