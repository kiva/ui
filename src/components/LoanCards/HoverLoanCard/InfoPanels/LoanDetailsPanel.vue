<template>
	<info-panel :id="elementId" :expandable="expandable">
		<template #title>
			Loan Details
		</template>
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
			<li>
				<label>Currency exchange loss:</label>
				<p class="data">
					{{ currencyExchangeLoss }}
				</p>
			</li>
			<li>
				<label>Facilitated by Field Partner:</label>
				<p class="data">
					{{ facilitatedByFieldPartnerFormatted }}
				</p>
			</li>
			<li>
				<label>Is borrower paying interest? </label>
				<p class="data">
					{{ borrowerPayingInterestFormatted }}
				</p>
			</li>
			<li>
				<label>Field Partner risk rating:</label>
				<p class="data">
					{{ riskRating }}
				</p>
			</li>
		</ul>
		<ul>
			<!-- The size of the following tag will need to be adjusted -->
			<h3>{{ country }} country facts</h3>
			<li>
				<label>Average annual income (USD):</label>
				<p class="data">
					{{ avgAnnualIncome }}
				</p>
			</li>
			<li>
				<label>Funds lent in {{ country }}:</label>
				<p class="data">
					{{ fundsLentInCountry }}
				</p>
			</li>
			<li>
				<label>Loans currently fundraising:</label>
				<p class="data">
					{{ loansCurrentlyFundraising }}
				</p>
			</li>
			<li>
				<label>Loans transacted in:</label>
				<p class="data">
					{{ loansTransactedIn }}
				</p>
			</li>
		</ul>
		<div>
			<h2>This loan is special because</h2>
			<p class="data">
				{{ whySpecial }}
			</p>
		</div>
	</info-panel>
</template>

<script>
import _get from 'lodash/get';
import {
	format,
	// differenceInMinutes,
	// differenceInHours,
	// differenceInDays
} from 'date-fns';
import InfoPanel from './InfoPanel';
// import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import loanDetailsQuery from '@/graphql/query/loanDetails.graphql';

export default {
	components: {
		InfoPanel,
		// KvLoadingSpinner,
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

			currencyExchangeLoss: 'test',
			riskRating: 'test',
			avgAnnualIncome: 'test',
			fundsLentInCountry: 'test',
			loansCurrentlyFundraising: 'test',
			loansTransactedIn: 'test',
			whySpecial: 'test',
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
			// This list of data is good
			this.country = _get(data, 'lend.loan.geocode.country.name');
			this.disbursalDate = _get(data, 'lend.loan.disbursalDate');
			this.loanLength = _get(data, 'lend.loan.lenderRepaymentTerm');
			this.repaymentSchedule = _get(data, 'lend.loan.repaymentInterval');
			this.borrowerPayingInterest = _get(data, 'lend.loan.partner.chargesFeesInterest');

			this.facilitatedByFieldPartner = _get(data, 'lend.loan.partnerName');
			this.trustee = _get(data, 'lend.loan.trusteeName');

			// This data needs to be formatted/calculated/verified
			this.currencyExchangeLoss = _get(data, 'lend.loan.hasCurrencyExchangeLossLenders');
			this.riskRating = _get(data, 'lend.loan.partner.riskRating');
			this.avgAnnualIncome = _get(data, 'lend.loan.partner.countries.ppp');
			this.fundsLentInCountry = _get(data, 'lend.loan.partner.countries.fundsLentInCountry');
			this.loansCurrentlyFundraising = _get(data, 'lend.loan.partner.countries.numLoansFundraising');
			// this.loansTransactedIn = _get(data, 'lend.loan.partner.countries.fundsLentInCountry');
			this.whySpecial = _get(data, 'lend.loan.whySpecial');
		},
	},
	computed: {
		elementId() {
			return `${this.loanId}-loan-details-panel-ex-${this.expandable ? '1' : '0'}`;
		},
		disbursalDateFormatted() {
			return format(this.disbursalDate, 'MMMM DD, YYYY');
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

ul {
	list-style: none;
}

label {
	display: inline-block;
}

.data {
	color: $kiva-green;
	display: inline-block;
}

.repayment-schedule-text {
	text-transform: capitalize;
}

#loading-overlay {
	position: absolute;
	width: auto;
	height: auto;
	left: 1rem;
	right: 1rem;
	bottom: 0;
	top: 0;
	background-color: rgba($platinum, 0.7);

	.spinner-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		height: 100%;
		top: auto;
		left: auto;
		transform: none;
		transition: top 100ms linear;
	}
}
</style>
