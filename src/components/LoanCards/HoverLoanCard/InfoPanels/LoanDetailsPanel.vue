<template>
	<info-panel :id="elementId" :expandable="expandable">
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
			class="loan-details-container"
		>
			<ul>
				<li>
					<label>Loan length:</label>
					<span class="data">
						{{ loanLength }} months
					</span>
				</li>
				<li>
					<label>Repayment schedule:</label>
					<span class="data repayment-schedule-text">
						{{ repaymentSchedule }}
					</span>
				</li>
				<li>
					<label>Disbursal date:</label>
					<p class="data">
						{{ disbursalDateFormatted }}
					</p>
				</li>
				<!-- <li>
					<label>Currency exchange loss:</label>
					<p class="data">
						{{ currencyExchangeLoss }}
					</p>
				</li> -->
				<li>
					<label>Facilitated by Field Partner:</label>
					<p class="data">
						{{ facilitatedByFieldPartnerFormatted }}
					</p>
				</li>
				<li>
					<label>Is borrower paying interest?</label>
					<p class="data">
						{{ borrowerPayingInterestFormatted }}
					</p>
				</li>
				<li>
					<label>Field Partner risk rating:</label>
					<p class="data">
						{{ riskRating }} stars
					</p>
				</li>
			</ul>
			<ul>
				<h3 class="country-heading">
					{{ country }} country facts
				</h3>
				<!-- <li>
					<label>Average annual income (USD):</label>
					<p class="data">
						{{ avgAnnualIncome }}
					</p>
				</li> -->
				<li>
					<label>Funds lent in {{ country }}:</label>
					<p class="data">
						{{ fundslentInCountryFormatted }}
					</p>
				</li>
				<li>
					<label>Loans currently fundraising:</label>
					<p class="data">
						{{ loansCurrentlyFundraising }}
					</p>
				</li>
				<!-- <li>
					<label>Loans transacted in:</label>
					<p class="data">
						{{ loansTransactedIn }}
					</p>
				</li> -->
			</ul>
			<div>
				<h3 class="why-special">
					This loan is special because
				</h3>
				<p class="data">
					{{ whySpecial }}
				</p>
			</div>
		</div>
	</info-panel>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import { format } from 'date-fns';
import InfoPanel from './InfoPanel';
import loanDetailsQuery from '@/graphql/query/loanDetails.graphql';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		InfoPanel,
		KvLoadingSpinner
	},
	inject: ['apollo'],
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
			loansCurrentlyFundraising: '',
			// loansTransactedIn: 'test',
			// currencyExchangeLoss: 'test',
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
			this.trustee = _get(data, 'lend.loan.trusteeName');
			this.whySpecial = _get(data, 'lend.loan.whySpecial');
			this.avgAnnualIncome = _get(data, 'lend.loan.partner.countries[0].ppp');
			this.fundsLentInCountry = _get(data, 'lend.loan.partner.countries[0].fundsLentInCountry');
			this.loansCurrentlyFundraising = _get(data, 'lend.loan.partner.countries[0].numLoansFundraising');

			// This needs to be formatted from the returned string into a star display
			// Ticket created for this: cash-1151
			this.riskRating = _get(data, 'lend.loan.partner.riskRating');

			// This data needs to be added/configured in graphql before displaying it
			// this.currencyExchangeLoss = _get(data, 'lend.loan.hasCurrencyExchangeLossLenders');
			// this.loansTransactedIn = _get(data, 'lend.loan.partner.countries.fundsLentInCountry');
		},
	},
	computed: {
		elementId() {
			return `${this.loanId}-loan-details-panel-ex-${this.expandable ? '1' : '0'}`;
		},
		disbursalDateFormatted() {
			return format(this.disbursalDate, 'MMMM DD, YYYY');
		},
		fundslentInCountryFormatted() {
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
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

.panel-title {
	margin-bottom: rem-calc(10);
}

ul {
	list-style: none;
	margin-left: 0;
}

.data {
	color: $kiva-green;
	margin-bottom: 0;
}

.repayment-schedule-text {
	text-transform: capitalize;
}

.country-heading,
.why-special {
	color: $black;
}
</style>
