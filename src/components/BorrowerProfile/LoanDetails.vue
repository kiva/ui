<template>
	<div v-if="loading" class="tw-pt-1.5">
		<description-list-loading :lines="6" />
		<div class="tw-flex tw-h-2" :class="condensed ? 'tw-mt-4.5' : 'tw-mt-6.5'">
			<kv-loading-placeholder style="width: 233px;" />
		</div>
	</div>
	<div v-else>
		<dl>
			<description-list-item
				data-testid="bp-loan-detail-loan-length"
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
				data-testid="bp-loan-detail-repayment-schedule"
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
				data-testid="bp-loan-detail-disbursed-date"
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
				v-if="terminalDateInfo"
				data-testid="bp-loan-detail-terminal-date"
				:term="terminalDateInfo.label"
				:details="formattedTerminalDate"
			/>
			<description-list-item
				data-testid="bp-loan-detail-funding-model"
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
				data-testid="bp-loan-detail-currency-loss"
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
				data-testid="bp-loan-detail-paying-interest"
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
		<repayment-schedule
			v-if="displayRepaymentSchedule"
			:loan-id="loanId"
			:status="status"
		/>
	</div>
</template>

<script>
import { gql } from 'graphql-tag';
import { format, parseISO } from 'date-fns';
import { KvLoadingPlaceholder } from '@kiva/kv-components';
import DescriptionListItem from '#src/components/BorrowerProfile/DescriptionListItem';
import DescriptionListLoading from '#src/components/BorrowerProfile/DescriptionListLoading';
import RepaymentSchedule from '#src/components/BorrowerProfile/RepaymentSchedule';

const loanDetailsQuery = gql`query borrowerProfileLoanDetails($loanId: Int!) {
	lend {
		loan(id: $loanId) {
			id
			status
			lenderRepaymentTerm
			repaymentInterval
			disbursalDate
			anonymizationLevel
			expiredDate
			refundedDate
			defaultedDate
			endedDate
			terms {
				currency
				flexibleFundraisingEnabled
				lenderRepaymentTerm
				lossLiabilityCurrencyExchange
			}
			... on LoanPartner {
				partner {
					id
					name
					chargesFeesInterest
				}
			}
		}
	}
}`;

export default {
	name: 'LoanDetails',
	components: {
		DescriptionListItem,
		DescriptionListLoading,
		KvLoadingPlaceholder,
		RepaymentSchedule,
	},
	inject: {
		apollo: {},
		cookieStore: {},
		condensed: { default: false },
	},
	emits: ['show-definition'],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
		isPrivileged: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			status: '',
			partnerName: '',
			chargesFeesInterest: false,
			loanLenderRepaymentTerm: 0,
			loanTermLenderRepaymentTerm: 0,
			repaymentInterval: '',
			flexibleFundraisingEnabled: false,
			currency: '',
			lossLiabilityCurrencyExchange: '',
			disbursalDate: '',
			anonymizationLevel: 'none',
			expiredDate: '',
			refundedDate: '',
			defaultedDate: '',
			endedDate: '',
			loading: true,
		};
	},
	apollo: {
		lazy: true,
		query: loanDetailsQuery,
		variables() {
			return { loanId: this.loanId };
		},
		result({ data }) {
			const loan = data?.lend?.loan;
			this.status = loan?.status ?? '';
			this.partnerName = loan?.partner?.name ?? '';
			this.chargesFeesInterest = loan?.partner?.chargesFeesInterest ?? false;
			this.loanLenderRepaymentTerm = loan?.lenderRepaymentTerm ?? 0;
			this.loanTermLenderRepaymentTerm = loan?.terms?.lenderRepaymentTerm ?? 0;
			this.repaymentInterval = loan?.repaymentInterval ?? '';
			this.flexibleFundraisingEnabled = loan?.terms?.flexibleFundraisingEnabled ?? false;
			this.currency = loan?.terms?.currency ?? '';
			this.lossLiabilityCurrencyExchange = loan?.terms?.lossLiabilityCurrencyExchange ?? '';
			this.disbursalDate = loan?.disbursalDate ?? '';
			this.anonymizationLevel = loan?.anonymizationLevel ?? 'none';
			this.expiredDate = loan?.expiredDate ?? '';
			this.refundedDate = loan?.refundedDate ?? '';
			this.defaultedDate = loan?.defaultedDate ?? '';
			this.endedDate = loan?.endedDate ?? '';
			this.loading = false;
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
			const intervalMap = { at_end: 'end of term' };
			const schedule = this.isPartnerLoan
				? intervalMap[this.repaymentInterval]
				|| this.repaymentInterval : 'Monthly';
			const scheduleUpperCase = schedule.toString().charAt(0).toUpperCase() + schedule.toString().slice(1);
			return scheduleUpperCase;
		},
		fundingModel() {
			return this.isPartnerLoan && this.flexibleFundraisingEnabled ? 'Flexible' : 'Fixed';
		},
		disbursedDate() {
			if (this.disbursalDate.length) {
				const formattedDisbursedDate = format(parseISO(this.disbursalDate), 'MMMM d, yyyy');
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
		terminalDateInfo() {
			if (this.expiredDate) return { label: 'Expired date', date: this.expiredDate };
			if (this.refundedDate) return { label: 'Refunded date', date: this.refundedDate };
			if (this.defaultedDate) return { label: 'Defaulted date', date: this.defaultedDate };
			if (this.endedDate) return { label: 'Ended date', date: this.endedDate };
			return null;
		},
		formattedTerminalDate() {
			if (!this.terminalDateInfo) return '';
			return format(parseISO(this.terminalDateInfo.date), 'MMMM d, yyyy');
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
		displayRepaymentSchedule() {
			// Don't show repayment schedule for fully anonymized loans
			if (this.anonymizationLevel === 'full') {
				return false;
			}
			// Always show for fundraising loans
			if (this.status === 'fundraising') {
				return true;
			}
			// For non-fundraising loans, only show to privileged users
			return this.isPrivileged;
		},
	}
};

</script>
