<template>
	<div v-if="loading">
		<div
			class="tw-flex"
			:class="condensed ? 'tw-mb-1.5 tw-h-6 md:tw-h-3' : 'tw-mb-1.5 tw-h-8 md:tw-h-6 lg:tw-h-3'"
		>
			<kv-loading-placeholder style="width: 90%;" />
		</div>
		<kv-loading-placeholder class="tw-mb-2" style="width: 50%; height: 2.25rem;" />
		<description-list-loading :lines="10" />
		<!-- Loading placeholder for the more about link -->
		<div class="tw-flex tw-h-2" :class="condensed ? 'tw-mt-2.5' : 'tw-mt-4'">
			<kv-loading-placeholder style="width: 200px;" />
		</div>
		<!-- Loading placeholders for the endorsement title and quote -->
		<div class="tw-flex tw-mt-4 tw-h-4">
			<kv-loading-placeholder style="width: 250px;" />
		</div>
		<div class="tw-flex tw-mt-2 tw-h-8 md:tw-h-5.5">
			<kv-loading-placeholder />
		</div>
	</div>
	<section v-else>
		<p
			:class="condensed ? 'tw-mb-1 tw-text-small' : 'tw-mb-1.5'"
			data-testid="bp-details-trustee-description"
		>
			Trustees are organizations that refer potential U.S.-based
			borrowers to Kiva and publicly vouch for them on Kiva.org.
		</p>
		<h2 class="tw-mb-2" data-testid="bp-details-trustee-name">
			{{ trusteeName }}
		</h2>
		<dl>
			<description-list-item
				data-testid="bp-details-trustee-tier"
				:term="'Tier'"
				:details="tierFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-trustee-tier',
					sfid: '50150000000s2c4',
					panelName: 'Trustee',
					linkText: 'Tier'
				})"
			/>
			<description-list-item
				data-testid="bp-details-trustee-location"
				:term="'Location'"
				:details="location"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-trustee-location',
					sfid: '50150000000s2c9',
					panelName: 'Trustee',
					linkText: 'Location'
				})"
			/>
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
				data-testid="bp-details-trustee-fundraising-or-raised"
				:term="'Fundraising/raised'"
				:details="numFundraisingLoansFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-trustee-fundraising-or-raised',
					sfid: '50150000000s2cT',
					panelName: 'Trustee',
					linkText: 'Fundraising/raised'
				})"
			/>
			<description-list-item
				data-testid="bp-details-trustee-paying-on-time"
				:term="'Paying on time'"
				:details="numPayingOnTimeLoansFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-trustee-paying-on-time',
					sfid: '50150000000s2cY',
					panelName: 'Trustee',
					linkText: 'Paying on time'
				})"
			/>
			<description-list-item
				data-testid="bp-details-trustee-paying-back-late"
				:term="'Paying back late'"
				:details="numPayingBackDelinquentLoansFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-trustee-paying-back-late',
					sfid: '50150000000s2cd',
					panelName: 'Trustee',
					linkText: 'Paying back late'
				})"
			/>
			<description-list-item
				data-testid="bp-details-trustee-repaid-in-full"
				:term="'Repaid in full'"
				:details="numRepaidInFullLoansFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-trustee-repaid-in-full',
					sfid: '50150000000s2ci',
					panelName: 'Trustee',
					linkText: 'Repaid in full'
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
			<h3>
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
import { capitalCase } from 'change-case';
import DescriptionListItem from '#src/components/BorrowerProfile/DescriptionListItem';
import DescriptionListLoading from '#src/components/BorrowerProfile/DescriptionListLoading';
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
					tier
					contactRecord {
						city
						state
						country {
							id
							name
							isoCode
						}
					}
					stats {
						id
						numDefaultedLoans
						numLoansEndorsedPublic
						numFundraisingLoans
						numPayingOnTimeLoans
						numPayingBackDelinquentLoans
						numRepaidInFullLoans
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
		cookieStore: {},
		condensed: { default: false },
	},
	components: {
		DescriptionListItem,
		DescriptionListLoading,
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
			tier: '',
			contactRecord: null,
			numFundraisingLoans: 0,
			numPayingOnTimeLoans: 0,
			numPayingBackDelinquentLoans: 0,
			numRepaidInFullLoans: 0,
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
			this.tier = trustee?.tier ?? '';
			this.contactRecord = trustee?.contactRecord ?? null;
			this.numFundraisingLoans = trustee?.stats?.numFundraisingLoans ?? 0;
			this.numPayingOnTimeLoans = trustee?.stats?.numPayingOnTimeLoans ?? 0;
			this.numPayingBackDelinquentLoans = trustee?.stats?.numPayingBackDelinquentLoans ?? 0;
			this.numRepaidInFullLoans = trustee?.stats?.numRepaidInFullLoans ?? 0;
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
		},
		tierFormatted() {
			if (!this.tier || this.tier === 'NO_STATUS') return 'N/A';
			return capitalCase(this.tier);
		},
		location() {
			const contact = this.contactRecord;
			if (!contact) return '';
			const isUnitedStates = contact.country?.isoCode === 'US';
			const region = isUnitedStates ? contact.state : contact.country?.name;
			return [contact.city, region].filter(Boolean).join(', ');
		},
		numFundraisingLoansFormatted() {
			return numeral(this.numFundraisingLoans).format('0,0');
		},
		numPayingOnTimeLoansFormatted() {
			return numeral(this.numPayingOnTimeLoans).format('0,0');
		},
		numPayingBackDelinquentLoansFormatted() {
			return numeral(this.numPayingBackDelinquentLoans).format('0,0');
		},
		numRepaidInFullLoansFormatted() {
			return numeral(this.numRepaidInFullLoans).format('0,0');
		}
	},
};

</script>
