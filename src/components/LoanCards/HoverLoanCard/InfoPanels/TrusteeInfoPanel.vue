<template>
	<info-panel :id="elementId" :expandable="expandable">
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
			<ul>
				<li v-if="this.trusteeName">
					<label>Trustee Name:</label>
					<span class="data">
						{{ trusteeName }}
					</span>
				</li>
				<li v-if="this.trusteeType">
					<label>Trustee type:</label>
					<span class="data">
						{{ trusteeType }}
					</span>
				</li>
				<li v-if="this.trusteeLocation">
					<label>Locatiion:</label>
					<p class="data">
						{{ trusteeLocation }}
					</p>
				</li>
				<li v-if="this.timeOnKiva">
					<label>Time on Kiva:</label>
					<p class="data">
						{{ timeOnKiva }}
					</p>
				</li>
				<li v-if="this.numBorrowers">
					<label>Kiva borrowers:</label>
					<p class="data">
						{{ numBorrowers }}
					</p>
				</li>
				<li v-if="this.totalLoanDollarValue">
					<label>Total loans:</label>
					<p class="data">
						{{ totalLoanDollarValue }}
					</p>
				</li>
				<li v-if="this.loansFundraisingRaised">
					<label>Fundraising/raised:</label>
					<p class="data">
						{{ loansFundraisingRaised }}
					</p>
				</li>
				<li v-if="this.loansPayingBackOnTime">
					<label>Paying back on time:</label>
					<p class="data">
						{{ loansPayingBackOnTime }}
					</p>
				</li>
				<li v-if="this.loansPayingBackLate">
					<label>Paying back late:</label>
					<p class="data">
						{{ loansPayingBackLate }}
					</p>
				</li>
				<li v-if="this.loansRepaidInFull">
					<label>Repaid in full:</label>
					<p class="data">
						{{ loansRepaidInFull }}
					</p>
				</li>
				<li v-if="this.loansDefaulted">
					<label>Defaulted:</label>
					<p class="data">
						{{ loansDefaulted }}
					</p>
				</li>
				<li v-if="this.repaymentRate">
					<label>Repayment rate:</label>
					<p class="data">
						{{ repaymentRate }}
					</p>
				</li>
			</ul>
			<div v-if="this.endorsement && this.endorsement != ''">
				<h3>Why are you endorsing {{ borrrowerName }}?:</h3>
				<p class="data">
					{{ endorsement }}
				</p>
			</div>
		</div>
	</info-panel>
</template>

<script>
import _get from 'lodash/get';
import InfoPanel from './InfoPanel';
import loanPartnerQuery from '@/graphql/query/loanPartner.graphql';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		InfoPanel,
		KvLoadingSpinner,
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
			borrowerName: '',
			trusteeName: '',
			trusteeType: '',
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
			this.borrowerName = _get(data, 'lend.loan.name');
			this.trusteeName = _get(data, 'lend.loan.trustee.title');
			this.trusteeType = _get(data, 'lend.loan.trustee.trusteeType');
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
		}
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
