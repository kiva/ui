<template>
	<section>
		<div v-if="loading">
			<!-- Loading placeholder for kv-tab elements -->
			<div class="tw-flex tw-mb-6 tw-h-3 lg:tw-h-4 tw-mt-0.5">
				<kv-loading-placeholder class="tw-mr-2.5 md:tw-mr-5 lg:tw-mr-6" style="width: 113px;" />
				<kv-loading-placeholder style="width: 157px;" />
			</div>
			<!-- Loading placeholder for description-list-item elements -->
			<description-list-loading :lines="6" />
			<!-- Loading placeholder for the detailed repayment schedule link -->
			<div class="tw-flex tw-h-2" :class="condensed ? 'tw-mt-4.5' : 'tw-mt-6.5'">
				<kv-loading-placeholder style="width: 233px;" />
			</div>
		</div>
		<kv-tabs v-else>
			<template #tabNav>
				<kv-tab
					:for-panel="loanTabId"
					:data-testid="`${testidPrefix}-loan-details-tab`"
					v-kv-track-event="['Borrower Profile', `${trackPrefix}-Loan-Details-tab`, 'Loan Details']"
				>
					Loan details
				</kv-tab>
				<kv-tab
					:for-panel="partnerTabId" v-if="isPartnerLoan"
					:data-testid="`${testidPrefix}-field-partner-tab`"
					v-kv-track-event="['Borrower Profile', `${trackPrefix}-Field-Partner-tab`, 'Field Partner']"
				>
					Lending Partner
				</kv-tab>
				<kv-tab
					:for-panel="trusteeTabId" v-if="hasTrustee"
					:data-testid="`${testidPrefix}-trustee-tab`"
					v-kv-track-event="[
						'Borrower Profile',
						`${trackPrefix}-Trustee-tab`,
						noTrusteeState ? 'No Trustee' : 'Trustee'
					]"
				>
					{{ noTrusteeState ? 'No Trustee' : 'Trustee' }}
				</kv-tab>
			</template>
			<template #tabPanels>
				<kv-tab-panel :id="loanTabId" :data-testid="`${testidPrefix}-loan-detail-panel`">
					<loan-details
						:loan-id="loanId"
						:is-privileged="isPrivileged"
						@show-definition="showDefinition"
					/>
				</kv-tab-panel>
				<kv-tab-panel
					:id="partnerTabId" v-if="isPartnerLoan"
					:data-testid="`${testidPrefix}-field-partner-panel`"
				>
					<field-partner-details :loan-id="loanId" @show-definition="showDefinition" />
				</kv-tab-panel>
				<kv-tab-panel
					:id="trusteeTabId" v-if="hasTrustee"
					:data-testid="`${testidPrefix}-trustee-panel`"
				>
					<trustee-details :loan-id="loanId" @show-definition="showDefinition" />
				</kv-tab-panel>
			</template>
		</kv-tabs>

		<details-definitions-lightbox ref="definitions" :use-sales-force="useSalesForce" />
	</section>
</template>

<script>
import { gql } from 'graphql-tag';
import {
	KvLoadingPlaceholder, KvTab, KvTabPanel, KvTabs
} from '@kiva/kv-components';
import DescriptionListLoading from './DescriptionListLoading';
import FieldPartnerDetails from './FieldPartnerDetails';
import LoanDetails from './LoanDetails';
import TrusteeDetails from './TrusteeDetails';
import DetailsDefinitionsLightbox from './DetailsDefinitionsLightbox';

const detailsTabsTypeQuery = gql`query borrowerProfileDetailsTabsType($loanId: Int!) {
	lend {
		loan(id: $loanId) {
			id
			__typename
			... on LoanDirect {
				trustee {
					id
					organizationName
				}
			}
		}
	}
}`;

export default {
	name: 'DetailsTabs',
	inject: ['apollo', 'cookieStore'],
	components: {
		DescriptionListLoading,
		DetailsDefinitionsLightbox,
		FieldPartnerDetails,
		KvLoadingPlaceholder,
		KvTab,
		KvTabPanel,
		KvTabs,
		LoanDetails,
		TrusteeDetails,
	},
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
		name: {
			type: String,
			required: true,
		},
		useSalesForce: {
			type: Boolean,
			default: false,
		},
		isPrivileged: {
			type: Boolean,
			default: false,
		},
		condensed: {
			type: Boolean,
			default: false,
		},
	},
	provide() {
		return {
			condensed: this.condensed,
		};
	},
	data() {
		return {
			loanType: '',
			trusteeName: '',
			loading: true,
		};
	},
	computed: {
		tabIdPrefix() {
			return this.condensed ? 'rail-tab-panel' : 'tab-panel';
		},
		testidPrefix() {
			return this.condensed ? 'bp-detail-rail' : 'bp-detail';
		},
		trackPrefix() {
			return this.condensed ? 'click-rail' : 'click';
		},
		isPartnerLoan() {
			return this.loanType === 'LoanPartner';
		},
		hasTrustee() {
			return this.loanType === 'LoanDirect' && !!this.trusteeName;
		},
		noTrusteeState() {
			return this.trusteeName === 'No Trustee Endorsement';
		},
		loanTabId() {
			return `${this.tabIdPrefix}-${this.name}-loan-details`;
		},
		partnerTabId() {
			return `${this.tabIdPrefix}-${this.name}-field-partner`;
		},
		trusteeTabId() {
			return `${this.tabIdPrefix}-${this.name}-trustee`;
		},
	},
	apollo: {
		lazy: true,
		query: detailsTabsTypeQuery,
		variables() {
			return { loanId: this.loanId };
		},
		result({ data }) {
			const loan = data?.lend?.loan;
			this.loanType = loan?.__typename ?? ''; // eslint-disable-line no-underscore-dangle
			this.trusteeName = loan?.trustee?.organizationName ?? '';
			this.loading = false;
		},
	},
	methods: {
		showDefinition(payload) {
			this.$refs.definitions.showDefinition(payload);
		},
	},
};
</script>
