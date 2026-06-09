<template>
	<div v-if="loading">
		<kv-loading-placeholder class="tw-mb-1.5" style="width: 90%; height: 3rem;" />
		<kv-loading-placeholder class="tw-mb-2" style="width: 50%; height: 1.5rem;" />
		<div v-for="i in 4" :key="i" class="tw-flex tw-justify-between tw-h-2 tw-mb-3">
			<kv-loading-placeholder :style="{width: 25 + (Math.random() * 20) + '%'}" />
			<kv-loading-placeholder :style="{width: 5 + (Math.random() * 5) + '%'}" />
		</div>
	</div>
	<section v-else>
		<p class="tw-mb-1.5" data-testid="bp-details-trustee-description">
			Trustees are organizations that refer potential U.S.-based
			borrowers to Kiva and publicly vouch for them on Kiva.org.
		</p>
		<h2 class="tw-text-headline tw-mb-2" data-testid="bp-details-trustee-name">
			{{ trusteeName }}
		</h2>
		<dl>
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
			<h3 class="tw-text-title">
				{{ endorsementTitle }}
			</h3>
			<blockquote>
				<p data-testid="bp-details-trustee-endorsement-text">
					{{ endorsement }}
				</p>
			</blockquote>
		</div>
	</section>
</template>

<script>
import { gql } from 'graphql-tag';
import { mdiArrowRight } from '@mdi/js';
import numeral from 'numeral';
import DescriptionListItem from '#src/components/BorrowerProfile/DescriptionListItem';
import { KvTextLink, KvLoadingPlaceholder } from '@kiva/kv-components';

const trusteeQuery = gql`query borrowerProfileTrustee($loanId: Int!) {
	lend {
		loan(id: $loanId) {
			id
			name
			... on LoanDirect {
				endorsement
				trustee {
					id
					organizationName
					stats {
						id
						numDefaultedLoans
						numLoansEndorsedPublic
						repaymentRate
						totalLoansValue
					}
				}
			}
		}
	}
}`;

export default {
	name: 'TrusteeDetails',
	inject: {
		apollo: {},
		condensed: { default: false },
	},
	components: {
		DescriptionListItem,
		KvTextLink,
		KvLoadingPlaceholder,
	},
	emits: ['show-definition'],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			mdiArrowRight,
			borrowerName: '',
			endorsement: '',
			trusteeName: '',
			numLoansEndorsedPublic: 0,
			totalLoansValue: '0.00',
			numDefaultedLoans: 0,
			repaymentRate: 0,
			trusteeId: 0,
			loading: true,
		};
	},
	apollo: {
		lazy: true,
		query: trusteeQuery,
		variables() {
			return { loanId: this.loanId };
		},
		result({ data }) {
			const loan = data?.lend?.loan;
			const trustee = loan?.trustee;
			this.borrowerName = loan?.name ?? '';
			this.endorsement = loan?.endorsement ?? '';
			this.trusteeName = trustee?.organizationName ?? '';
			this.trusteeId = trustee?.id ?? 0;
			this.numLoansEndorsedPublic = trustee?.stats?.numLoansEndorsedPublic ?? 0;
			this.totalLoansValue = trustee?.stats?.totalLoansValue ?? '0.00';
			this.numDefaultedLoans = trustee?.stats?.numDefaultedLoans ?? 0;
			this.repaymentRate = trustee?.stats?.repaymentRate ?? 0;
			this.loading = false;
		},
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
