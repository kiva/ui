<template>
	<section>
		<div v-if="loading">
			<!-- Loading placeholder for kv-tab elements -->
			<div class="tw-flex tw-mb-6 tw-h-3 lg:tw-h-4 tw-mt-0.5">
				<kv-loading-placeholder class="tw-mr-2.5 md:tw-mr-5 lg:tw-mr-6" style="width: 113px;" />
				<kv-loading-placeholder style="width: 157px;" />
			</div>
			<!-- Loading placeholder for description-list-item elements -->
			<div v-for="i in 6" :key="i" class="tw-flex tw-justify-between tw-h-2 tw-mb-3">
				<kv-loading-placeholder :style="{width: 20 + (Math.random() * 20) + '%'}" />
				<kv-loading-placeholder :style="{width: 5 + (Math.random() * 5) + '%'}" />
			</div>
			<!-- Loading placeholder for the detailed repayment schedule link -->
			<div class="tw-flex tw-h-2 tw-mt-6.5">
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
						:status="loan.status"
						:charges-fees-interest="partner.chargesFeesInterest"
						:currency="loan.currency"
						:flexible-fundraising-enabled="loan.flexibleFundraisingEnabled"
						:loan-lender-repayment-term="loan.loanLenderRepaymentTerm"
						:loan-term-lender-repayment-term="loan.loanTermLenderRepaymentTerm"
						:loss-liability-currency-exchange="loan.lossLiabilityCurrencyExchange"
						:partner-name="partner.name"
						:repayment-interval="loan.repaymentInterval"
						:disbursal-date="loan.disbursalDate"
						:expired-date="loan.expiredDate"
						:refunded-date="loan.refundedDate"
						:defaulted-date="loan.defaultedDate"
						:ended-date="loan.endedDate"
						@show-definition="showDefinition"
					/>
					<repayment-schedule
						v-if="displayRepaymentSchedule"
						:loan-id="loanId"
						:status="loan.status"
					/>
				</kv-tab-panel>
				<kv-tab-panel
					:id="partnerTabId" v-if="isPartnerLoan"
					:data-testid="`${testidPrefix}-field-partner-panel`"
				>
					<field-partner-details
						:arrears-rate="partner.arrearsRate"
						:avg-borrower-cost="partner.avgBorrowerCost"
						:avg-borrower-cost-type="partner.avgBorrowerCostType"
						:avg-profitability="partner.avgProfitability"
						:default-rate="partner.defaultRate"
						:loans-at-risk-rate="partner.loansAtRiskRate"
						:partner-id="partner.id"
						:partner-name="partner.name"
						:risk-rating="partner.riskRating"
						:currency-exchange-loss-rate="partner.currencyExchangeLossRate"
						:start-date="partner.startDate"
						:loans-posted="partner.loansPosted"
						:total-amount-raised="partner.totalAmountRaised"
						:avg-loan-size-percent-per-capita-income="partner.avgLoanSizePercentPerCapitaIncome"
						@show-definition="showDefinition"
					/>
				</kv-tab-panel>
				<kv-tab-panel
					:id="trusteeTabId" v-if="hasTrustee"
					:data-testid="`${testidPrefix}-trustee-panel`"
				>
					<trustee-details
						:borrower-name="loan.name"
						:endorsement="trustee.endorsement"
						:num-defaulted-loans="trustee.numDefaultedLoans"
						:num-loans-endorsed-public="trustee.numLoansEndorsedPublic"
						:repayment-rate="trustee.repaymentRate"
						:trustee-id="trustee.id"
						:trustee-name="trustee.name"
						:total-loans-value="trustee.totalLoansValue"
						@show-definition="showDefinition"
					/>
				</kv-tab-panel>
			</template>
		</kv-tabs>

		<details-definitions-lightbox ref="definitions" :use-sales-force="useSalesForce" />
	</section>
</template>

<script>
import {
	KvLoadingPlaceholder, KvTab, KvTabPanel, KvTabs
} from '@kiva/kv-components';
import FieldPartnerDetails from './FieldPartnerDetails';
import LoanDetails from './LoanDetails';
import TrusteeDetails from './TrusteeDetails';
import RepaymentSchedule from './RepaymentSchedule';
import DetailsDefinitionsLightbox from './DetailsDefinitionsLightbox';
import { loanDetailsQuery, mapLoanDetailsResult } from './loanDetailsQuery';

export default {
	name: 'DetailsTabs',
	inject: ['apollo', 'cookieStore'],
	components: {
		DetailsDefinitionsLightbox,
		FieldPartnerDetails,
		KvLoadingPlaceholder,
		KvTab,
		KvTabPanel,
		KvTabs,
		LoanDetails,
		TrusteeDetails,
		RepaymentSchedule,
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
			...mapLoanDetailsResult(null),
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
			return !!this.partner?.name;
		},
		hasTrustee() {
			return !this.isPartnerLoan && this.trustee?.name;
		},
		loanTabId() {
			return `${this.tabIdPrefix}-${this.name}-loan-details`;
		},
		noTrusteeState() {
			return this.trustee?.name === 'No Trustee Endorsement';
		},
		partnerTabId() {
			return `${this.tabIdPrefix}-${this.name}-field-partner`;
		},
		trusteeTabId() {
			return `${this.tabIdPrefix}-${this.name}-trustee`;
		},
		displayRepaymentSchedule() {
			// Don't show repayment schedule for fully anonymized loans
			if (this.loan.anonymizationLevel === 'full') {
				return false;
			}
			// Always show for fundraising loans
			if (this.loan.status === 'fundraising') {
				return true;
			}
			// For non-fundraising loans, only show to privileged users
			return this.isPrivileged;
		}
	},
	apollo: {
		lazy: true,
		query: loanDetailsQuery,
		variables() {
			return { loanId: this.loanId };
		},
		result({ data }) {
			const { loan, partner, trustee } = mapLoanDetailsResult(data);
			this.loan = loan;
			this.partner = partner;
			this.trustee = trustee;
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
