<template>
	<section class="tw-prose tw-py-4 md:tw-py-6 lg:tw-py-8">
		<div v-if="loading">
			<!-- Loading placeholder for kv-tab elements -->
			<div class="tw-flex tw-mb-4.5 md:tw-mb-5 tw-h-2.5 md:tw-h-3 lg:tw-h-4">
				<kv-loading-placeholder class="tw-mr-2.5 md:tw-mr-5 lg:tw-mr-6" style="width: 22%;" />
				<kv-loading-placeholder style="width: 22%;" />
			</div>
			<!-- Loading placeholder for description-list-item elements -->
			<div v-for="i in 5" :key="i" class="tw-flex tw-justify-between tw-h-2 tw-mb-4">
				<kv-loading-placeholder :style="{width: 20 + (Math.random() * 20) + '%'}" />
				<kv-loading-placeholder :style="{width: 5 + (Math.random() * 5) + '%'}" />
			</div>
		</div>
		<kv-tabs v-else>
			<template #tabNav>
				<kv-tab :for="loanTabId">
					Loan details
				</kv-tab>
				<kv-tab :for="partnerTabId" v-if="isPartnerLoan">
					Field Partner
				</kv-tab>
				<kv-tab :for="trusteeTabId" v-if="hasTrustee">
					Trustee
				</kv-tab>
			</template>
			<template #tabPanels>
				<kv-tab-panel :id="loanTabId">
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
					/>
				</kv-tab-panel>
				<kv-tab-panel :id="partnerTabId" v-if="isPartnerLoan">
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
					/>
				</kv-tab-panel>
				<kv-tab-panel :id="trusteeTabId" v-if="hasTrustee">
					<trustee-details
						:num-defaulted-loans="trustee.numDefaultedLoans"
						:num-loans-endorsed-public="trustee.numLoansEndorsedPublic"
						:repayment-rate="trustee.repaymentRate"
						:trustee-id="trustee.id"
						:trustee-name="trustee.name"
						:total-loans-value="trustee.totalLoansValue"
					/>
				</kv-tab-panel>
			</template>
		</kv-tabs>
	</section>
</template>

<script>
import gql from 'graphql-tag';
import { createIntersectionObserver } from '@/util/observerUtils';
// TODO: replace the loading placeholder with component from kv-components when available.
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import KvTab from '~/@kiva/kv-components/vue/KvTab';
import KvTabPanel from '~/@kiva/kv-components/vue/KvTabPanel';
import KvTabs from '~/@kiva/kv-components/vue/KvTabs';
import FieldPartnerDetails from './FieldPartnerDetails';
import LoanDetails from './LoanDetails';
import TrusteeDetails from './TrusteeDetails';

export default {
	inject: ['apollo'],
	components: {
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
	},
	data() {
		return {
			loan: {
				currency: '',
				flexibleFundraisingEnabled: false,
				loanLenderRepaymentTerm: 0,
				loanTermLenderRepaymentTerm: 0,
				lossLiabilityCurrencyExchange: '',
				repaymentInterval: '',
			},
			loading: true,
			observer: null,
			partner: {
				arrearsRate: 0,
				avgBorrowerCost: 0,
				avgBorrowerCostType: '',
				avgProfitability: 0,
				chargesFeesInterest: false,
				defaultRate: 0,
				id: 0,
				loansAtRiskRate: 0,
				name: '',
				riskRating: 0,
			},
			trustee: {
				id: 0,
				name: '',
				numDefaultedLoans: 0,
				numLoansEndorsedPublic: 0,
				repaymentRate: 0,
				totalLoansValue: '0',
			},
		};
	},
	computed: {
		isPartnerLoan() {
			return !!this.partner?.name;
		},
		hasTrustee() {
			return !this.isPartnerLoan && this.trustee?.name && this.trustee?.name !== 'No Trustee Endorsement';
		},
		loanTabId() {
			return `tab-panel-${this.name}-loan-details`;
		},
		partnerTabId() {
			return `tab-panel-${this.name}-field-partner`;
		},
		trusteeTabId() {
			return `tab-panel-${this.name}-trustee`;
		},
	},
	methods: {
		createObserver() {
			// Watch for this element being close to entering the viewport
			this.observer = createIntersectionObserver({
				targets: [this.$el],
				rootMargin: '500px',
				callback: entries => {
					entries.forEach(entry => {
						if (entry.target === this.$el && entry.intersectionRatio > 0) {
							// This element is close to being in the viewport, so load the data.
							// Because of the apollo cache it's safe to call this repeatedly.
							this.loadData();
						}
					});
				}
			});
			if (!this.observer) {
				// Observer was not created, so call loadData right away as a fallback.
				this.loadData();
			}
		},
		destroyObserver() {
			if (this.observer) {
				this.observer.disconnect();
			}
		},
		loadData() {
			this.apollo.query({
				query: gql`query loanDetails($loanId: Int!) {
					lend {
						loan(id: $loanId) {
							id
							status
							lenderRepaymentTerm
							repaymentInterval
							disbursalDate
							terms {
								currency
								flexibleFundraisingEnabled
								lenderRepaymentTerm
								lossLiabilityCurrencyExchange
							}
							... on LoanDirect {
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
							... on LoanPartner {
								partner {
									arrearsRate
									avgBorrowerCost
									avgBorrowerCostType
									chargesFeesInterest
									defaultRate
									id
									loansAtRiskRate
									name
									riskRating
								}
							}
						}
					}
				}`,
				variables: {
					loanId: this.loanId
				},
			}).then(result => {
				const loan = result?.data?.lend?.loan;
				const partner = loan?.partner;
				const trustee = loan?.trustee;

				this.loan.currency = loan?.terms?.currency ?? '';
				this.loan.flexibleFundraisingEnabled = loan?.terms?.flexibleFundraisingEnabled ?? false;
				this.loan.loanLenderRepaymentTerm = loan?.lenderRepaymentTerm ?? 0;
				this.loan.loanTermLenderRepaymentTerm = loan?.terms?.lenderRepaymentTerm ?? 0;
				this.loan.lossLiabilityCurrencyExchange = loan?.terms?.lossLiabilityCurrencyExchange ?? '';
				this.loan.repaymentInterval = loan?.repaymentInterval ?? '';
				this.loan.disbursalDate = loan.disbursalDate ?? '';
				this.loan.status = loan.status ?? '';

				this.partner.arrearsRate = partner?.arrearsRate ?? 0;
				this.partner.avgBorrowerCost = partner?.avgBorrowerCost ?? 0;
				this.partner.avgBorrowerCostType = partner?.avgBorrowerCostType ?? '';
				this.partner.avgProfitability = partner?.avgProfitability ?? 0;
				this.partner.chargesFeesInterest = partner?.chargesFeesInterest ?? false;
				this.partner.defaultRate = partner?.defaultRate ?? 0;
				this.partner.id = partner?.id ?? 0;
				this.partner.loansAtRiskRate = partner?.loansAtRiskRate ?? 0;
				this.partner.name = partner?.name ?? '';
				this.partner.riskRating = partner?.riskRating ?? 0;

				this.trustee.id = trustee?.id ?? 0;
				this.trustee.name = trustee?.organizationName ?? '';
				this.trustee.numDefaultedLoans = trustee?.stats?.numDefaultedLoans ?? 0;
				this.trustee.numLoansEndorsedPublic = trustee?.stats?.numLoansEndorsedPublic ?? 0;
				this.trustee.repaymentRate = trustee?.stats?.repaymentRate ?? 0;
				this.trustee.totalLoansValue = trustee?.stats?.totalLoansValue ?? '0';

				this.loading = false;
			});
		},
	},
	mounted() {
		this.createObserver();
	},
	beforeDestroy() {
		this.destroyObserver();
	},
};
</script>
