<template>
	<info-panel :id="elementId" :expandable="expandable">
		<template #title>
			Field Partner info
		</template>
		<div
			v-if="!timeOnKivaFormatted"
			id="loading-overlay"
		>
			<div class="spinner-wrapper">
				<kv-loading-spinner />
			</div>
		</div>
		<div v-else>
			<ul>
				<li v-if="this.timeOnKiva">
					<label>Time on Kiva:</label>
					<span class="data">
						{{ timeOnKivaFormatted }} months
					</span>
				</li>
				<li v-if="this.numOfBorrowers">
					<label>Kiva borrowers:</label>
					<span class="data">
						{{ numOfBorrowersFormatted }}
					</span>
				</li>
				<li v-if="this.totalAmountRaised">
					<label>Total loans:</label>
					<p class="data">
						{{ totalAmountRaisedFormatted }}
					</p>
				</li>
				<!-- <li>
					<label>Average cost to borrower:</label>
					<p class="data">
						{{}}
					</p>
				</li> -->
				<!-- <li>
					<label>Profitabilty (return on assets):</label>
					<p class="data">
						{{}}
					</p>
				</li> -->
				<li v-if="this.avgLoanSize">
					<label>Average loan size (% per capita income):</label>
					<p class="data">
						{{ avgLoanSize }}
					</p>
				</li>
				<li v-if="this.deliquencyRate">
					<label>Deliquency rate:</label>
					<p class="data">
						{{ deliquencyRate }}%
					</p>
				</li>
				<li v-if="this.riskRate">
					<label>Loans at risk rate:</label>
					<p class="data">
						{{ riskRateFormatted }}%
					</p>
				</li>
				<li v-if="this.defaultRate">
					<label>Default rate:</label>
					<p class="data">
						{{ defaultRateFormatted }}%
					</p>
				</li>
				<li v-if="this.currencyExchangeLossRate">
					<label>Currency exchange loss rate:</label>
					<p class="data">
						{{ currencyExchangeLossRateFormatted }}%
					</p>
				</li>
			</ul>
			<div v-if="this.loanAlertText && this.loanAlertText != ''">
				<h3 class="loan-alert-text">Why Kiva works with this partner:</h3>
				<p class="data">
					{{ loanAlertText }}
				</p>
			</div>
		</div>
	</info-panel>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import {
	format,
	differenceInCalendarMonths
} from 'date-fns';
import InfoPanel from './InfoPanel';
import loanPartnerQuery from '@/graphql/query/loanPartner.graphql';
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
			timeOnKiva: 0,
			numOfBorrowers: 0,
			totalAmountRaised: 0,
			avgLoanSize: '',
			deliquencyRate: '',
			riskRate: '',
			defaultRate: '',
			currencyExchangeLossRate: '',
			loanAlertText: '',
		};
	},
	apollo: {
		query: loanPartnerQuery,
		variables() {
			return {
				id: parseInt(this.loanId, 10),
			};
		},
		result({ data }) {
			this.timeOnKiva = _get(data, 'lend.loan.partner.startDate');
			this.numOfBorrowers = _get(data, 'lend.loan.partner.loansPosted');
			this.totalAmountRaised = _get(data, 'lend.loan.partner.totalAmountRaised');
			this.avgLoanSize = _get(data, 'lend.loan.partner.avgLoanSizePercentPerCapitaIncome');
			this.deliquencyRate = _get(data, 'lend.loan.partner.delinquencyRateNote');
			this.riskRate = _get(data, 'lend.loan.partner.loansAtRiskRate');
			this.defaultRate = _get(data, 'lend.loan.partner.defaultRate');
			this.currencyExchangeLossRate = _get(data, 'lend.loan.partner.currencyExchangeLossRate');
			this.loanAlertText = _get(data, 'lend.loan.partner.loanAlertText');
		},
	},
	computed: {
		elementId() {
			return `${this.loanId}-partner-info-panel-ex-${this.expandable ? '1' : '0'}`;
		},
		timeOnKivaFormatted() {
			const formattedNow = format(Date.now(), 'YYYY, M, D');
			const formattedStartDate = format(this.timeOnKiva, 'YYYY, M, D');
			return differenceInCalendarMonths(formattedNow, formattedStartDate);
		},
		totalAmountRaisedFormatted() {
			return numeral(this.totalAmountRaised).format('$0,0');
		},
		riskRateFormatted() {
			return numeral(this.riskRate).format('0.00');
		},
		numOfBorrowersFormatted() {
			return numeral(this.numOfBorrowers).format('0,0');
		},
		defaultRateFormatted() {
			return numeral(this.defaultRate).format('0.00');
		},
		currencyExchangeLossRateFormatted() {
			return numeral(this.currencyExchangeLossRate).format('0.00');
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

ul {
	list-style: none;
}

.data {
	color: $kiva-green;
}
</style>
