<template>
	<info-panel
		:id="elementId"
		:expandable="expandable"
		panel-id="loan-details"
		@track-interaction="trackInteraction"
	>
		<template #title>
			Loan Details
		</template>
		<div v-if="!loanLength" id="loading-overlay">
			<div class="spinner-wrapper">
				<kv-loading-spinner />
			</div>
		</div>
		<div
			v-else
			class="loan-details-container tw-prose"
		>
			<dl>
				<div v-if="this.loanLength">
					<dt>Loan length:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ loanLength }} months
					</dd>
				</div>
				<div v-if="this.repaymentSchedule">
					<dt>Repayment schedule:</dt>
					<dd class="tw-text-brand tw-my-0.5 tw-capitalize">
						{{ repaymentSchedule }}
					</dd>
				</div>
				<div v-if="this.disbursalDate">
					<dt>Disbursal date:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ disbursalDateFormatted }}
					</dd>
				</div>
				<div v-if="this.fundingModel !== ''">
					<dt>Funding model:</dt>
					<dd class="tw-text-brand tw-my-0.5 tw-capitalize">
						{{ fundingModelFormatted }}
					</dd>
				</div>
				<div>
					<dt v-if="this.currencyLossLiability">
						Partner covers currency loss:
					</dt>
					<dt v-else>
						Currency exchange loss:
					</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ currencyLossLiabilityFormatted }}
					</dd>
				</div>
				<div v-if="this.facilitatedByFieldPartner">
					<dt>Facilitated by Field Partner/trustee:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ facilitatedByFieldPartnerFormatted }}
					</dd>
				</div>
				<div v-if="this.borrowerPayingInterest">
					<dt>Is borrower paying interest?</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ borrowerPayingInterestFormatted }}
					</dd>
				</div>
				<div v-if="this.riskRating">
					<dt>Field Partner risk rating:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ riskRating }} stars
					</dd>
				</div>
			</dl>
			<template
				v-if="this.fundsLentInCountry
					|| this.partnerLoansCurrentlyFundraising
					|| this.directLoansCurrentlyFundraising"
			>
				<h3 class="tw-mb-1 tw-mt-4">
					{{ country }} country facts
				</h3>
				<dl>
					<!-- <div v-if="this.avgAnnualIncome">
					<dt>Average annual income (USD):</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ avgAnnualIncome }}
					</p>
				</div> -->
					<div v-if="this.fundsLentInCountry">
						<dt>Funds lent in {{ country }}:</dt>
						<dd class="tw-text-brand tw-my-0.5">
							{{ fundsLentInCountryFormatted }}
						</dd>
					</div>
					<div v-if="this.partnerLoansCurrentlyFundraising">
						<dt>Loans currently fundraising:</dt>
						<dd class="tw-text-brand tw-my-0.5">
							{{ partnerLoansCurrentlyFundraising }}
						</dd>
					</div>
					<div v-if="this.directLoansCurrentlyFundraising">
						<dt>Loans currently fundraising:</dt>
						<dd class="tw-text-brand tw-my-0.5">
							{{ directLoansCurrentlyFundraising }}
						</dd>
					</div>
				<!-- <div v-if="this.loansTransactedIn">
					<dt>Loans transacted in:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ loansTransactedIn }}
					</dd>
				</div> -->
				</dl>
			</template>
			<div v-if="this.whySpecial">
				<h3 class="tw-mb-1 tw-mt-4">
					This loan is special because
				</h3>
				<p class="tw-text-brand">
					{{ whySpecial }}
				</p>
			</div>
		</div>
	</info-panel>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import { format, parseISO } from 'date-fns';
import loanDetailsQuery from '@/graphql/query/loanDetails.graphql';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import InfoPanel from './InfoPanel';

export default {
	name: 'LoanDetailsPanel',
	components: {
		InfoPanel,
		KvLoadingSpinner
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		expandable: {
			type: Boolean,
			default: true,
		},
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			country: '',
			disbursalDate: '',
			loanLength: '',
			repaymentSchedule: '',
			borrowerPayingInterest: '',
			facilitatedByFieldPartner: '',
			whySpecial: '',
			riskRating: '',
			avgAnnualIncome: '',
			fundsLentInCountry: '',
			partnerLoansCurrentlyFundraising: '',
			directLoansCurrentlyFundraising: '',
			fundingModel: '',
			// loansTransactedIn: 'test',
			currencyLossLiability: '',
			currencyExchangeLoss: '',
		};
	},
	apollo: {
		query: loanDetailsQuery,
		variables() {
			return {
				id: parseInt(this.loanId, 10),
			};
		},
		result({ data }) {
			this.country = _get(data, 'lend.loan.geocode.country.name');
			this.disbursalDate = _get(data, 'lend.loan.disbursalDate');
			this.loanLength = _get(data, 'lend.loan.lenderRepaymentTerm');
			this.repaymentSchedule = _get(data, 'lend.loan.repaymentInterval');
			this.borrowerPayingInterest = _get(data, 'lend.loan.partner.chargesFeesInterest');
			this.facilitatedByFieldPartner = _get(data, 'lend.loan.partnerName');
			this.trustee = _get(data, 'lend.loan.trustee.name');
			this.whySpecial = _get(data, 'lend.loan.whySpecial');
			this.avgAnnualIncome = _get(data, 'lend.loan.partner.countries[0].ppp');
			this.fundsLentInCountry = _get(data, 'lend.loan.partner.countries[0].fundsLentInCountry');
			this.partnerLoansCurrentlyFundraising = _get(data, 'lend.loan.partner.countries[0].numLoansFundraising');
			this.directLoansCurrentlyFundraising = _get(data, 'lend.loan.trusteeStats.numLoansFundraising');
			this.fundingModel = _get(data, 'lend.loan.terms.flexibleFundraisingEnabled');
			this.currencyLossLiability = _get(data, 'lend.loan.terms.lossLiabilityCurrencyExchange');
			this.currencyExchangeLoss = _get(data, 'lend.loan.hasCurrencyExchangeLossLenders');

			// This needs to be formatted from the returned string into a star display
			// Ticket created for this: cash-1151
			this.riskRating = _get(data, 'lend.loan.partner.riskRating');
		},
	},
	computed: {
		elementId() {
			return `${this.loanId}-loan-details-panel-ex-${this.expandable ? '1' : '0'}`;
		},
		disbursalDateFormatted() {
			return format(parseISO(this.disbursalDate), 'MMMM dd, yyyy');
		},
		fundsLentInCountryFormatted() {
			return numeral(this.fundsLentInCountry).format('$0,0');
		},
		borrowerPayingInterestFormatted() {
			// Alters borrowerPayingInterest boolean FROM true/false TO yes/no
			let formattedReturn = this.borrowerPayingInterest;
			if (formattedReturn === false) {
				formattedReturn = 'No';
			}
			if (formattedReturn === true) {
				formattedReturn = 'Yes';
			}
			return formattedReturn;
		},
		facilitatedByFieldPartnerFormatted() {
			let facilitatedByFieldPartnerFormatted = '';
			if (this.facilitatedByFieldPartner !== '') {
				facilitatedByFieldPartnerFormatted = this.facilitatedByFieldPartner;
			} else if (this.trustee !== '') {
				facilitatedByFieldPartnerFormatted = this.trustee;
			} else if (this.facilitatedByFieldPartner === '' && this.trustee === '') {
				facilitatedByFieldPartnerFormatted = 'Not facilitated by a Field Partner or Trustee';
			}
			return facilitatedByFieldPartnerFormatted;
		},
		fundingModelFormatted() {
			if (this.fundingModel === true) {
				return 'flexible';
			}
			return 'fixed';
		},
		currencyLossLiabilityFormatted() {
			let currencyLossLiabilityFormatted = '';
			if (this.currencyLossLiability === '' || this.currencyLossLiability === 'none') {
				currencyLossLiabilityFormatted = 'N/A';
			} else if (this.currencyLossLiability === 'shared') {
				currencyLossLiabilityFormatted = 'Partially';
			} else if (this.currencyLossLiability === 'partner') {
				currencyLossLiabilityFormatted = 'Yes';
			} else if (this.currencyLossLiability === 'lender') {
				currencyLossLiabilityFormatted = 'No';
			}
			return currencyLossLiabilityFormatted;
		}
	},
	methods: {
		trackInteraction(args) {
			this.$emit('track-interaction', args);
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.panel-title {
	margin-bottom: rem-calc(10);
}

.repayment-schedule-text,
.funding-model-text {
	text-transform: capitalize;
}
</style>
