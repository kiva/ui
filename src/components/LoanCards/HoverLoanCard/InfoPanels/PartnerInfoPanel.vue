<template>
	<info-panel
		:id="elementId"
		:expandable="expandable"
		panel-id="partner-info"
		@track-interaction="trackInteraction"
	>
		<template #title>
			Field Partner info
		</template>
		<div
			v-if="!timeOnKiva"
			id="loading-overlay"
		>
			<div class="spinner-wrapper">
				<kv-loading-spinner />
			</div>
		</div>
		<div v-else>
			<dl>
				<div v-if="this.timeOnKiva">
					<dt>Time on Kiva:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ timeOnKivaFormatted }} months
					</dd>
				</div>
				<div v-if="this.numOfBorrowers">
					<dt>Kiva borrowers:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ numOfBorrowersFormatted }}
					</dd>
				</div>
				<div v-if="this.totalAmountRaised">
					<dt>Total loans:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ totalAmountRaisedFormatted }}
					</dd>
				</div>
				<div v-if="this.avgCostToBorrower">
					<dt>Average cost to borrower:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ avgCostToBorrower }}% {{ avgCostToBorrowerType }}
					</dd>
				</div>
				<!-- <div>
					<dt>Profitabilty (return on assets):</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{}}
					</dd>
				</div> -->
				<div v-if="this.avgLoanSize">
					<dt>Average loan size (% per capita income):</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ avgLoanSize }}%
					</dd>
				</div>
				<div v-if="this.deliquencyRate">
					<dt>Deliquency rate:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ deliquencyRate }}%
					</dd>
				</div>
				<div v-if="this.riskRate">
					<dt>Loans at risk rate:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ riskRateFormatted }}%
					</dd>
				</div>
				<div v-if="this.defaultRate">
					<dt>Default rate:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ defaultRateFormatted }}%
					</dd>
				</div>
				<div v-if="this.currencyExchangeLossRate">
					<dt>Currency exchange loss rate:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ currencyExchangeLossRateFormatted }}%
					</dd>
				</div>
			</dl>
			<div v-if="this.loanAlertText && this.loanAlertText != ''">
				<h3 class="tw-mb-1 tw-mt-4">
					Why Kiva works with this partner:
				</h3>
				<p class="tw-prose" v-html="loanAlertText"></p>
			</div>
		</div>
	</info-panel>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import { differenceInCalendarMonths, parseISO } from 'date-fns';
import loanPartnerQuery from '@/graphql/query/loanPartner.graphql';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import InfoPanel from './InfoPanel';

export default {
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
			timeOnKiva: 0,
			numOfBorrowers: 0,
			totalAmountRaised: 0,
			avgLoanSize: '',
			avgCostToBorrower: '',
			avgCostToBorrowerType: '',
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
			this.avgCostToBorrower = _get(data, 'lend.loan.partner.avgBorrowerCost');
			this.avgCostToBorrowerType = _get(data, 'lend.loan.partner.avgBorrowerCostType');
		},
	},
	computed: {
		elementId() {
			return `${this.loanId}-partner-info-panel-ex-${this.expandable ? '1' : '0'}`;
		},
		timeOnKivaFormatted() {
			return differenceInCalendarMonths(Date.now(), parseISO(this.timeOnKiva));
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
	methods: {
		trackInteraction(args) {
			this.$emit('track-interaction', args);
		},
	},
};
</script>
