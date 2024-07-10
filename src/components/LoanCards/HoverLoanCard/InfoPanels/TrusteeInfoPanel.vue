<template>
	<info-panel
		:id="elementId"
		:expandable="expandable"
		panel-id="trustee-info"
		@track-interaction="trackInteraction"
	>
		<template #title>
			Trustee info
		</template>
		<div
			id="loading-overlay"
			v-if="!this.trusteeName"
		>
			<div class="spinner-wrapper">
				<kv-loading-spinner />
			</div>
		</div>
		<div v-else>
			<dl>
				<div v-if="this.trusteeName">
					<dt>Trustee Name:</dt>
					<span class="data">
						{{ trusteeName }}
					</span>
				</div>
				<div v-if="this.trusteeLocation">
					<dt>Location:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ trusteeLocation }}
					</dd>
				</div>
				<div v-if="this.timeOnKiva">
					<dt>Time on Kiva:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ timeOnKivaFormatted }} months
					</dd>
				</div>
				<div v-if="this.numBorrowers">
					<dt>Kiva borrowers:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ numBorrowers }}
					</dd>
				</div>
				<div v-if="this.totalLoanDollarValue">
					<dt>Total loans:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ totalDollarValueFormatted }}
					</dd>
				</div>
				<div v-if="this.loansFundraisingRaised">
					<dt>Fundraising/raised:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ loansFundraisingRaised }}
					</dd>
				</div>
				<div v-if="this.loansPayingBackOnTime">
					<dt>Paying back on time:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ loansPayingBackOnTime }}
					</dd>
				</div>
				<div v-if="this.loansPayingBackLate">
					<dt>Paying back late:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ loansPayingBackLate }}
					</dd>
				</div>
				<div v-if="this.loansRepaidInFull">
					<dt>Repaid in full:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ loansRepaidInFull }}
					</dd>
				</div>
				<div v-if="this.loansDefaulted">
					<dt>Defaulted:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ loansDefaulted }}
					</dd>
				</div>
				<div v-if="this.repaymentRate">
					<dt>Repayment rate:</dt>
					<dd class="tw-text-brand tw-my-0.5">
						{{ repaymentRateFormatted }}
					</dd>
				</div>
			</dl>
			<div v-if="this.endorsement && this.endorsement != ''">
				<h3 class="tw-mb-1 tw-mt-4">
					Why are you endorsing this borrower?
				</h3>
				<p class="tw-prose">
					{{ endorsement }}
				</p>
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
	name: 'TrusteeInfoPanel',
	components: {
		InfoPanel,
		KvLoadingSpinner,
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
			// borrowerName: '',
			trusteeName: '',
			trusteeLocation: '',
			timeOnKiva: '',
			numBorrowers: '',
			totalLoanDollarValue: '',
			loansFundraisingRaised: '',
			loansPayingBackOnTime: '',
			loansPayingBackLate: '',
			loansRepaidInFull: '',
			loansDefaulted: '',
			repaymentRate: '',
			endorsement: '',
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
			// this.borrowerName = _get(data, 'lend.loan.name');
			this.trusteeName = _get(data, 'lend.loan.trustee.organizationName');
			this.trusteeLocation = _get(data, 'lend.loan.trustee.trusteeLocation');
			this.timeOnKiva = _get(data, 'lend.loan.trustee.memberSince');
			this.numBorrowers = _get(data, 'lend.loan.trustee.trusteeStats.numLoansEndorsedPublic');
			this.totalLoanDollarValue = _get(data, 'lend.loan.trustee.trusteeStats.totalLoansValue');
			this.loansFundraisingRaised = _get(data, 'lend.loan.trustee.trusteeStats.numFundraisingLoans');
			this.loansPayingBackOnTime = _get(data, 'lend.loan.trustee.trusteeStats.numPayingBackOnTimeLoans');
			this.loansPayingBackLate = _get(data, 'lend.loan.trustee.trusteeStats.numPayingBackDelinquentLoans');
			this.loansRepaidInFull = _get(data, 'lend.loan.trustee.trusteeStats.numRepaidInFullLoans');
			this.loansDefaulted = _get(data, 'lend.loan.trustee.trusteeStats.numDefaultedLoans');
			this.repaymentRate = _get(data, 'lend.loan.trustee.trusteeStats.repaymentRate');
			this.endorsement = _get(data, 'lend.loan.endorsement');
		},
	},
	computed: {
		elementId() {
			return `${this.loanId}-trustee-info-panel-ex-${this.expandable ? '1' : '0'}`;
		},
		timeOnKivaFormatted() {
			return differenceInCalendarMonths(Date.now(), parseISO(this.timeOnKiva));
		},
		repaymentRateFormatted() {
			return numeral(this.repaymentRate).format('0.00');
		},
		totalDollarValueFormatted() {
			return numeral(this.totalDollarValue).format('0.00');
		},
	},
	methods: {
		trackInteraction(args) {
			this.$emit('track-interaction', args);
		},
	},
};
</script>
