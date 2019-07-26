<template>
	<info-panel :id="elementId" :expandable="expandable">
		<template #title>
			Loan Details
		</template>
		<ul>
			<li>
				<label>Loan length:</label>
				<span class="data">
					{{ }}
				</span>
			</li>
			<li>
				<label>Repayment schedule:</label>
				<span class="data">
					{{ repaymentSchedule }} months
				</span>
			</li>
			<li>
				<label>Disbursal date:</label>
				<p class="data">
					{{ disbursalDate }}
				</p>
			</li>
			<li>
				<label>Currency exchange loss:</label>
				<p class="data">
					<!-- I don't think this is the right piece of data -->
					{{ currencyExchangeLoss }}
				</p>
			</li>
			<li>
				<label>Facilitated by Field Partner:</label>
				<p class="data">
					{{}}
				</p>
			</li>
			<li>
				<label>Is borrower paying interest? </label>
				<p class="data">
					{{ borrowerPayingInterest }}
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
		}
	},
	data() {
		return {
			country: 'test',
			loanLength: 'test',
			repaymentSchedule: 'test',
			disbursalDate: 'test',
			currencyExchangeLoss: 'test',
			borrowerPayingInterest: 'test',
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
			this.country = _get(data, 'lend.loan.geocode.country.name');
			// this.loanLength = _get(data, 'lend.loan.')
			this.repaymentSchedule = _get(data, 'lend.loan.lenderRepaymentTerm');
			// This date needs to be formatted
			this.disbursalDate = _get(data, 'lend.loan.disbursalDate');
			this.currencyExchangeLoss = _get(data, 'lend.loan.hasCurrencyExchangeLossLenders');
			this.borrowerPayingInterest = _get(data, 'lend.loan.partner.chargesFeesInterest');
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
