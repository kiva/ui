<template>
	<section v-if="displayTrusteeSection">
		<p>
			Trustees are U.S.-based individuals or organizations that refer potential borrowers to Kiva.
		</p>
		<h2>
			{{ trusteeName }}
		</h2>
		<dl>
			<description-list-item
				:term="'Kiva borrowers'"
				:details="numLoansEndorsedTotal"
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
		<a
			:href="`/partners/${trusteeId}`"
			class="tw-uppercase"
		>
			More about this trustee
		</a>
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
		numLoansEndorsedTotal: { // TrusteeStats.numLoansEndorsedTotal
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
		displayTrusteeSection() {
			return this.trusteeName !== '' && this.trusteeName !== 'No Trustee Endorsement';
		},
		totalLoansValueFormatted() {
			return numeral(this.totalLoansValue).format('$0,0[.]00');
		},
		repaymentRateFormatted() {
			return numeral(this.repaymentRate).format('0%');
		},
	},
};

</script>
