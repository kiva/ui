<template>
	<section class="tw-prose">
		<p data-testid="bp-details-trustee-description">
			Trustees are organizations that refer potential U.S.-based
			borrowers to Kiva and publicly vouch for them on Kiva.org.
		</p>
		<h2 data-testid="bp-details-trustee-name">
			{{ trusteeName }}
		</h2>
		<dl class="tw-mb-4">
			<description-list-item
				data-testid="bp-details-trustee-kiva-borrowers"
				:term="'Kiva borrowers'"
				:details="numLoansEndorsedPublicFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-trustee-kiva-borrowers',
					sfid: '50150000000s2cE',
					panelName: 'Trustee',
					linkText: 'Kiva borrowers'
				})"
			/>
			<description-list-item
				data-testid="bp-details-trustee-total-loans"
				:term="'Total loans'"
				:details="totalLoansValueFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-trustee-total-loans',
					sfid: '50150000000s2cO',
					panelName: 'Trustee',
					linkText: 'Total loans'
				})"
			/>
			<description-list-item
				data-testid="bp-details-trustee-loans-defaulted"
				:term="'Loans defaulted'"
				:details="numDefaultedLoansFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-trustee-loans-defaulted',
					sfid: '50150000000s2cn',
					panelName: 'Trustee',
					linkText: 'Loans defaulted'
				})"
			/>
			<description-list-item
				data-testid="bp-details-trustee-repayment-rate"
				:term="'Repayment rate'"
				:details="repaymentRateFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-trustee-repayment-rate',
					sfid: '50150000000s2cx',
					panelName: 'Trustee',
					linkText: 'Repayment rate'
				})"
			/>
		</dl>
		<kv-text-link
			data-testid="bp-details-trustee-more-about-link"
			:icon="mdiArrowRight"
			:href="`/trustees/${trusteeId}`"
			target="_blank"
			v-kv-track-event="[
				'Borrower profile',
				'click-Trustee-tab',
				noTrusteeState ? 'More about loans without endorsements' : 'More about this trustee'
			]"
		>
			{{ noTrusteeState ? 'More about loans without endorsements' : 'More about this trustee' }}
		</kv-text-link>
		<div v-if="endorsement" class="tw-prose tw-my-3" data-testid="bp-details-trustee-endorsement">
			<h3>{{ endorsementTitle }}</h3>
			<blockquote>
				<p data-testid="bp-details-trustee-endorsement-text">
					{{ endorsement }}
				</p>
			</blockquote>
		</div>
	</section>
</template>

<script>
import { mdiArrowRight } from '@mdi/js';
import numeral from 'numeral';
import DescriptionListItem from '@/components/BorrowerProfile/DescriptionListItem';
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';

export default {
	components: {
		DescriptionListItem,
		KvTextLink,
	},
	props: {
		borrowerName: {
			type: String,
			default: '',
		},
		endorsement: { // endorsement
			type: String,
			default: '',
		},
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
	data() {
		return {
			mdiArrowRight,
		};
	},
	computed: {
		endorsementTitle() {
			return `Why are you endorsing ${this.borrowerName}?`;
		},
		noTrusteeState() {
			return this.trusteeName === 'No Trustee Endorsement';
		},
		totalLoansValueFormatted() {
			return numeral(this.totalLoansValue).format('$0,0[.]00');
		},
		repaymentRateFormatted() {
			return numeral(this.repaymentRate / 100).format('0%');
		},
		numLoansEndorsedPublicFormatted() {
			return numeral(this.numLoansEndorsedPublic).format('0,0');
		},
		numDefaultedLoansFormatted() {
			return numeral(this.numDefaultedLoans).format('0,0');
		}
	},
};

</script>
