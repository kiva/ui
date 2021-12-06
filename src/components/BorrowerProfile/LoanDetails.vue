<template>
	<dl>
		<description-list-item
			:term="'Loan length'"
			:details="`${loanLength} months`"
			@show-definition="$emit('show-definition', {
				cid: 'bp-def-loan-length',
				sfid: '50150000000Ry3z',
				panelName: 'Loan-Details',
				linkText: 'Loan length'
			})"
		/>
		<description-list-item
			:term="'Repayment schedule'"
			:details="repaymentSchedule"
			@show-definition="$emit('show-definition', {
				cid: 'bp-def-repayment-schedule',
				sfid: '50150000000Ry44',
				panelName: 'Loan-Details',
				linkText: 'Repayment schedule'
			})"
		/>
		<description-list-item
			:term="'Disbursed date'"
			:details="disbursedDate"
			@show-definition="$emit('show-definition', {
				cid: 'bp-def-disbursed-date',
				sfid: '50150000000RyAs',
				panelName: 'Loan-Details',
				linkText: 'Disbursed date'
			})"
		/>
		<description-list-item
			:term="'Funding model'"
			:details="fundingModel"
			@show-definition="$emit('show-definition', {
				cid: 'bp-def-funding-model',
				sfid: '5011T000001GNKy',
				panelName: 'Loan-Details',
				linkText: 'Funding model'
			})"
		/>
		<description-list-item
			:term="currencyLossScenarioTerm"
			:details="currencyLossScenarioDetails"
			@show-definition="$emit('show-definition', {
				cid: 'bp-def-partner-covers-currency-loss',
				sfid: '50150000000J5kV',
				panelName: 'Loan-Details',
				linkText: currencyLossScenarioTerm
			})"
		/>
		<description-list-item
			:term="'Is borrower paying interest?'"
			:details="borrowerPayingInterest"
			@show-definition="$emit('show-definition', {
				cid: 'bp-def-do-borrowers-pay-interest',
				sfid: '50150000000IIav',
				panelName: 'Loan-Details',
				linkText: 'Is borrower paying interest?'
			})"
		/>
	</dl>
</template>

<script>
import { format, parseISO } from 'date-fns';
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
		disbursalDate: { // LoanBasic.disbursalDate
			type: String,
			default: '',
		},
		status: {
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
		disbursedDate() {
			if (this.disbursalDate.length) {
				const formattedDisbursedDate = format(parseISO(this.disbursalDate), 'MMMM dd, yyyy');
				return formattedDisbursedDate;
			} if (!this.disbursalDate.length && this.status === 'expired') {
				return 'N/A, expired before fully funding';
			}
			return 'After fully funded on Kiva';
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
