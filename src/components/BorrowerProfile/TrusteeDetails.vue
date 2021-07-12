<template>
	<section>
		<p>
			Trustees are organizations that refer potential U.S.-based
			borrowers to Kiva and publicly vouch for them on Kiva.org.
		</p>
		<h2>
			{{ trusteeName }}
		</h2>
		<dl class="tw-mb-4">
			<description-list-item
				:term="'Kiva borrowers'"
				:details="numLoansEndorsedPublic"
			/>
			<description-list-item
				:term="'Total loans'"
				:details="totalLoansValueFormatted"
			/>
			<description-list-item
				:term="'Loans defaulted'"
				:details="numDefaultedLoans"
			/>
			<description-list-item
				:term="'Repayment rate'"
				:details="repaymentRateFormatted"
			/>
		</dl>
		<router-link
			:to="`/trustees/${trusteeId}`"
			class="tw-text-h4"
		>
			More about this trustee &rarr;
		</router-link>
	</section>
</template>

<script>
import numeral from 'numeral';
import DescriptionListItem from '@/components/BorrowerProfile/DescriptionListItem';

export default {
	components: {
		DescriptionListItem,
	},
	props: {
		trusteeName: { // LoanDirect.trusteeName
			type: String,
			default: '',
		},
		numLoansEndorsedPublic: { // TrusteeStats.numLoansEndorsedPublic
			type: Number,
			default: 0,
		},
		totalLoansValue: { // TrusteeStats.totalLoansValue
			type: String,
			default: '0.00',
		},
		numDefaultedLoans: { // TrusteeStats.numDefaultedLoans
			type: Number,
			default: 0,
		},
		repaymentRate: { // TrusteeStats.repaymentRate
			type: Number,
			default: 0,
		},
		trusteeId: { // TrusteeStats.trusteeId
			type: Number,
			default: 0,
		},
	},
	computed: {
		totalLoansValueFormatted() {
			return numeral(this.totalLoansValue).format('$0,0[.]00');
		},
		repaymentRateFormatted() {
			return numeral(this.repaymentRate).format('0%');
		},
	},
};

</script>
