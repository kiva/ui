<template>
	<section class="tw-py-4 md:tw-py-6 lg:tw-py-8">
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
				<kv-tab
					:for-panel="loanTabId"
					data-testid="bp-detail-loan-details-tab"
					v-kv-track-event="['Borrower Profile', `click-Loan-Details-tab`, 'Loan Details']"
				>
					Loan details
				</kv-tab>
				<kv-tab
					:for-panel="partnerTabId" v-if="isPartnerLoan"
					data-testid="bp-detail-field-partner-tab"
					v-kv-track-event="['Borrower Profile', `click-Field-Partner-tab`, 'Field Partner']"
				>
					Field Partner
				</kv-tab>
				<kv-tab
					:for-panel="trusteeTabId" v-if="hasTrustee"
					data-testid="bp-detail-trustee-tab"
					v-kv-track-event="[
						'Borrower Profile',
						'click-Trustee-tab',
						noTrusteeState ? 'No Trustee' : 'Trustee'
					]"
				>
					{{ noTrusteeState ? 'No Trustee' : 'Trustee' }}
				</kv-tab>
			</template>
			<template #tabPanels>
				<kv-tab-panel :id="loanTabId" data-testid="bp-detail-loan-detail-panel">
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
					data-testid="bp-detail-field-partner-panel"
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
						@show-definition="showDefinition"
					/>
				</kv-tab-panel>
				<kv-tab-panel
					:id="trusteeTabId" v-if="hasTrustee"
					data-testid="bp-detail-trustee-panel"
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

		<kv-lightbox
			:visible="isLightboxVisible"
			:title="lightboxTitle"
			@lightbox-closed="closeLightbox"
		>
			<div v-html="lightboxContent" class="tw-prose"></div>
		</kv-lightbox>
	</section>
</template>

<script>
import gql from 'graphql-tag';
import { formatContentGroupsFlat } from '@/util/contentfulUtils';
// TODO: replace the loading placeholder with component from kv-components when available.
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvTab from '~/@kiva/kv-components/vue/KvTab';
import KvTabPanel from '~/@kiva/kv-components/vue/KvTabPanel';
import KvTabs from '~/@kiva/kv-components/vue/KvTabs';
import FieldPartnerDetails from './FieldPartnerDetails';
import LoanDetails from './LoanDetails';
import TrusteeDetails from './TrusteeDetails';
import RepaymentSchedule from './RepaymentSchedule';

export default {
	name: 'DetailsTabs',
	inject: ['apollo'],
	components: {
		FieldPartnerDetails,
		KvLightbox,
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
		}
	},
	data() {
		return {
			contentfulDefinitions: null,
			isLightboxVisible: false,
			lightboxContent: null,
			lightboxTitle: '',
			loan: {
				name: '',
				currency: '',
				flexibleFundraisingEnabled: false,
				loanLenderRepaymentTerm: 0,
				loanTermLenderRepaymentTerm: 0,
				lossLiabilityCurrencyExchange: '',
				repaymentInterval: '',
				anonymizationLevel: '',
				lentTo: false,
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
				endorsement: '',
			},
		};
	},
	computed: {
		isPartnerLoan() {
			return !!this.partner?.name;
		},
		hasTrustee() {
			return !this.isPartnerLoan && this.trustee?.name;
		},
		loanTabId() {
			return `tab-panel-${this.name}-loan-details`;
		},
		noTrusteeState() {
			return this.trustee?.name === 'No Trustee Endorsement';
		},
		partnerTabId() {
			return `tab-panel-${this.name}-field-partner`;
		},
		trusteeTabId() {
			return `tab-panel-${this.name}-trustee`;
		},
		isSupporter() {
			return this.loan?.lentTo || false;
		},
		displayRepaymentSchedule() {
			// check anonymization of loan, if it's not set to
			// full anonymization, continue
			if (this.loan.anonymizationLevel !== 'full') {
				// if loan is fundraising, always display the repayment schedule
				if (this.loan.status === 'fundraising') {
					return true;
				}
				// otherwise look at the isSupporter flag to determine if
				// the repayment schedule should be shown to current user,
				// if they are logged in
				return this.isSupporter;
			}
			// if loan is set to full anonymization, return false
			// because the repayment schedule should not be shown.
			return false;
		}
	},
	methods: {
		closeLightbox() {
			// close lightbox
			this.isLightboxVisible = false;
			// clear content
			this.lightboxTitle = '';
			this.lightboxContent = null;
		},
		loadContentfulDefintions(contentEntryKey) {
			this.apollo.query({
				query: gql`query contentfulDefinitions {
					contentful {
						entries(contentKey: "borrower-profile-definitions", contentType: "contentGroup")
					}
				}`,
			}).then(result => {
				// assign and show lightbox content
				const contentfulData = result.data?.contentful?.entries?.items ?? null;
				if (contentfulData) {
					const contentfulDataFormatted = formatContentGroupsFlat(contentfulData);
					this.contentfulDefinitions = contentfulDataFormatted.borrowerProfileDefinitions?.contents ?? null;
					// show originally requested entry
					this.showContentfulEntry(contentEntryKey);
				}
			});
		},
		loadData() {
			this.apollo.query({
				query: gql`query loanDetails($loanId: Int!) {
					lend {
						loan(id: $loanId) {
							id
							name
							status
							lenderRepaymentTerm
							repaymentInterval
							disbursalDate
							anonymizationLevel
							userProperties {
								lentTo
							}
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
								endorsement
							}
							... on LoanPartner {
								partner {
									arrearsRate
									avgBorrowerCost
									avgBorrowerCostType
									avgProfitability
									chargesFeesInterest
									defaultRate
									id
									loansAtRiskRate
									name
									riskRating
									currencyExchangeLossRate
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
				this.loan.disbursalDate = loan?.disbursalDate ?? '';
				this.loan.status = loan?.status ?? '';
				this.loan.name = loan?.name ?? '';
				this.loan.anonymizationLevel = loan?.anonymizationLevel ?? 'none';
				this.loan.lentTo = loan?.userProperties?.lendTo ?? false;

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
				this.partner.currencyExchangeLossRate = partner?.currencyExchangeLossRate ?? 0;

				this.trustee.endorsement = loan?.endorsement ?? '';
				this.trustee.id = trustee?.id ?? 0;
				this.trustee.name = trustee?.organizationName ?? '';
				this.trustee.numDefaultedLoans = trustee?.stats?.numDefaultedLoans ?? 0;
				this.trustee.numLoansEndorsedPublic = trustee?.stats?.numLoansEndorsedPublic ?? 0;
				this.trustee.repaymentRate = trustee?.stats?.repaymentRate ?? 0;
				this.trustee.totalLoansValue = trustee?.stats?.totalLoansValue ?? '0';

				this.loading = false;
			});
		},
		showContentfulEntry(contentKey) {
			// check for loaded data
			if (!this.contentfulDefinitions) {
				this.loadContentfulDefintions(contentKey);
				return false;
			}
			// extract target entry
			const contentfulEntry = this.contentfulDefinitions.find(entry => entry.key === contentKey);
			// setup and show lightbox content
			if (contentfulEntry) {
				this.lightboxTitle = contentfulEntry.name;
				this.lightboxContent = documentToHtmlString(contentfulEntry.richText);
				this.isLightboxVisible = true;
			}
		},
		showDefinition(payload) {
			// track definition pop up click
			this.$kvTrackEvent('Borrower Profile', `click-${payload.panelName}-tab-definition-link`, payload.linkText);

			if (this.useSalesForce) {
				this.showSalesforceSolution(payload.sfid);
			} else {
				this.showContentfulEntry(payload.cid);
			}
		},
		showSalesforceSolution(solutionId) {
			// fetch data
			this.apollo.query({
				query: gql`query salesforceSolution($id: String!) {
					general {
						salesforceSolution(id: $id) {
							name
							note
						}
					}
				}`,
				variables: {
					id: solutionId
				}
			}).then(result => {
				// assign and show lightbox content
				const solutionData = result?.data?.general?.salesforceSolution ?? null;
				const solutionTitle = solutionData?.name ?? '';
				const solutionContent = solutionData?.note ?? null;
				if (solutionData) {
					this.lightboxTitle = solutionTitle;
					this.lightboxContent = solutionContent;
					this.isLightboxVisible = true;
				}
			});
		},
	},
	mounted() {
		this.loadData();
	},

};
</script>
