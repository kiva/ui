<template>
	<div>
		<div v-if="!enabledExperiment">
			<div class="row borrower-profile-wrapper">
				<div class="small-12 medium-4 columns">
					<!-- Borrower photo -->
					<loan-card-image
						:loan-id="loan.id"
						:name="loan.name"
						:retina-image-url="loan.image.retina"
						:standard-image-url="loan.image.default"
						:is-visitor="true"
						v-kv-track-event="['basket', 'basket-loan-profile', 'basket-loan-profile']"
						:open-in-new-tab="true"
						:use-default-styles="false"
					/>
				</div>
				<div class="small-12 medium-8 columns">
					<h2
						class="tw-text-action tw-inline-block"
						v-if="loan.status==='funded'"
					>
						100%
					</h2>
					<h2 class="tw-text-action tw-inline-block tw-capitalize">
						{{ loan.status }}
					</h2>
					<!-- Total funded/loan amount -->
					<div class="tw-mt-1">
						Total loan: ${{ loan.loanFundraisingInfo.fundedAmount | numeral('0,0') }}
					</div>
					<!-- Borrower Name -->
					<h1> {{ loan.name }} </h1>
					<!-- Borrower location -->
					<div class="tw-mt-2">
						<div class="loan-location-flag">
							<kv-flag :country="`${ loan.geocode.country.isoCode }`" />
						</div>
						<span>
							{{ loan.geocode.city }}, {{ loan.geocode.state }}, {{ loan.geocode.country.name }}
							/ {{ loan.sector.name }}
						</span>

						<div>
							<!-- Link to see full borrower profile in old stack -->
							<router-link
								:to="`/lend-classic/${loan.id}?minimal=false`"
								v-kv-track-event="['Lending', 'full-borrower-profile-exit-link']"
							>
								See full borrower profile
							</router-link>
						</div>
					</div>
				</div>
			</div>
			<!-- Loans you might light section -->
			<div class="row lyml-wrapper">
				<div class="small-12 columns">
					<hr class="tw-border-tertiary">
					<h3 class="tw-text-center tw-mb-2 tw-mt-3" v-html="lymlHeading"></h3>
					<l-y-m-l
						class="tw-mb-3"
						:basketed-loans="itemsInBasket"
						:target-loan="loan"
					/>
				</div>
			</div>
			<hr class="tw-border-tertiary">
			<div class="row">
				<div class="small-12 columns tw-text-center tw-py-4">
					<!-- Loan use -->
					<h2>
						A loan helped {{ loan.use }}
					</h2>
				</div>
			</div>
			<hr class="tw-border-tertiary">
			<div class="row">
				<div class="small-12 columns loan-description-wrapper tw-pt-4">
					<h2 class="tw-mb-4">
						{{ loan.name }}'s story
					</h2>
					<!-- Loan description -->
					<div v-html="loan.description"></div>
				</div>
			</div>
		</div>
		<div v-else>
			<article class="tw-relative tw-bg-secondary">
				<div class="tw-relative">
					<div class="tw-absolute tw-top-0 tw-h-full tw-w-full tw-overflow-hidden">
						<hero-background />
					</div>
					<kv-page-container>
						<kv-grid class="md:tw-grid-cols-12 tw-grid tw-relative">
							<div class="md:tw-col-span-8 md:tw-col-start-3 tw-my-8">
								<section
									class="
									tw-pb-0
									md:tw-bg-primary
									md:tw-pb-2.5
									tw-py-2.5 md:tw-p-3 lg:tw-p-4
									md:tw-rounded"
								>
									<div class="tw-flex">
										<div
											class="
									tw-flex-none tw-w-8 tw-h-8 tw-mr-1.5 tw-mb-1.5
									md:tw-w-9 md:tw-h-9 md:tw-mr-3 md:tw-mb-3
									lg:tw-w-10 lg:tw-h-10 lg:tw-mr-4 lg:tw-mb-4"
										>
											<borrower-image
												data-testid="bp-summary-image"
												class="tw-w-full tw-rounded-full tw-bg-brand"
												:alt="loan.name"
												:aspect-ratio="1"
												:hash="hash"
												:default-image="{ width: 80, faceZoom: 50 }"
												:images="[
													{ width: 80, faceZoom: 50, viewSize: 1024 },
													{ width: 72, faceZoom: 50, viewSize: 734 },
													{ width: 64, faceZoom: 50 },
												]"
											/>
										</div>
										<div class="tw-flex-auto">
											<borrower-name
												data-testid="bp-summary-borrower-name"
												:name="loan.name"
											/>
											<loan-progress
												data-testid="bp-summary-progress"
												class="tw-mb-2"
												:money-left="'0'"
												:progress-percent="1"
												loan-status="funded"
											/>
										</div>
									</div>
								</section>
							</div>
						</kv-grid>
					</kv-page-container>
				</div>
			</article>
			<article class="tw-mx-2 tw-overflow-auto lg:tw-mx-auto loans-container">
				<p class="tw-text-center tw-text-h1 tw-my-6">
					Similar borrowers that need your support
				</p>
				<div :key="index" v-for="(category, index) in categories" class="tw-my-6">
					<p class="tw-text-h2">
						{{ category.heading }}
					</p>
					<p v-if="category.subHeading" class="tw-text-subhead">
						{{ category.subHeading }} {{ loan.name }}'s loan.
					</p>
					<div v-if="!category.loan">
						<kiva-classic-loan-carousel
							v-if="!category.loan"
							:is-visible="true"
							:loan-ids="category.loanIds"
							:exp-label="category.expLabel"
							:lend-now-button="true"
						/>
					</div>
					<div v-else class="featured-loan-card-row tw-pt-4">
						<loan-card-controller
							v-if="category.loan"
							category-set-id="featured-hero-loan"
							:enable-tracking="true"
							:key="category.loan.id"
							:loan="category.loan"
							loan-card-type="FeaturedHeroLoan"
							:position="1"
							:row-number="0"
							:is-visitor="isVisitor"
						/>
					</div>
				</div>
			</article>
		</div>
		<div ref="preBottom">
			<div v-if="isLoading" id="loading-overlay">
				<div class="spinner-wrapper">
					<kv-loading-spinner />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import logReadQueryError from '@/util/logReadQueryError';
import KvFlag from '@/components/Kv/KvFlag';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import LYML from '@/components/LoansYouMightLike/LymlContainer';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import { createIntersectionObserver } from '@/util/observerUtils';
import HeroBackground from '@/components/BorrowerProfile/HeroBackground';
import BorrowerName from '@/components/BorrowerProfile/BorrowerName';
import LoanProgress from '@/components/BorrowerProfile/LoanProgress';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import KivaClassicLoanCarousel from '@/components/LoanCollections/KivaClassicLoanCarousel';
import personalizedLoansQuery from '@/graphql/query/lendByCategory/personalizedLoans.graphql';
import mlLoansYouMightLikeData from '@/graphql/query/loansYouMightLike/mlLoansYouMightLikeData.graphql';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import {
	getExperimentSettingCached,
	trackExperimentVersion
} from '@/util/experimentUtils';
import { FLSS_ORIGIN_BP_FUNDED } from '@/util/flssUtils';
import loanUseFilter from '@/plugins/loan-use-filter';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

const newFundedBorrowerPageExpKey = 'new_funded_borrower_page';

export default {
	name: 'FundedBorrowerProfile',
	metaInfo() {
		return {
			title: `${this.loan.name} from ${this.loan.geocode?.country?.name}'s loan has been funded!`,
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: `A loan helped ${this.loan.use}`,
				}
			].concat(
				[
					{
						property: 'og:title',
						vmid: 'og:title',
						content: this.shareTitle
					},
					{
						property: 'og:description',
						vmid: 'og:description',
						content: this.shareDescription
					},
					{
						name: 'twitter:description',
						vmid: 'twitter:description',
						content: this.shareDescription
					}
				]
			)
		};
	},
	components: {
		LoanCardImage,
		KvFlag,
		LYML,
		KvLoadingSpinner,
		HeroBackground,
		BorrowerName,
		LoanProgress,
		BorrowerImage,
		KvGrid,
		KvPageContainer,
		KivaClassicLoanCarousel,
		LoanCardController,
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		loan: {
			type: Object,
			default: () => {}
		},
		hash: {
			type: String,
			default: ''
		},
		itemsInBasket: {
			type: Array,
			default: () => []
		},
		inviterName: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			viewportObserver: null,
			isLoading: false,
			categories: [],
			rows: null,
			isVisitor: true,
			loanRowsCount: 4,
			loanUseMaxLength: 100,
			anonymizationLevel: 'none',
			enabledExperiment: true,
			shareCardLanguageVersion: '',
			inviterIsGuestOrAnonymous: false,
			basketedLoans: []
		};
	},
	computed: {
		lymlHeading() {
			const defaultMessage = `${this.loan.name}'s loan finished fundraising,
				but these similar borrowers need your support`;
			const customMessage = `${this.loan.name}'s loan finished fundraising,<br class="show-for-medium">
				but these similar borrowers just need a little more help to reach their goals!`;
			return this.lymlCustomSort === 'random' ? defaultMessage : customMessage;
		},
		shareTitle() {
			if (this.shareCardLanguageVersion === 'b') {
				// eslint-disable-next-line max-len
				return this.inviterName === '' ? `Can you help support ${this.loan.name}?` : `Can you help ${this.inviterName} support ${this.loan.name}?`;
			}

			return `Lend as little as $25 to ${this.loan.name}`;
		},
		shareDescription() {
			if (this.shareCardLanguageVersion === 'b') {
				// eslint-disable-next-line max-len
				return 'Kiva is a loan, not a donation. With Kiva you can lend as little as $25 and make a big change in someone\'s life.';
			}

			if (this.anonymizationLevel !== 'full') {
				const loanUse = loanUseFilter(this.loan.use, this.loan.name, this.loan.status, this.loan?.loanAmount,
					this.loan?.borrowerCount, this.loanUseMaxLength);
				return `${loanUse}\n\n${this.loan.description.substring(0, 120)}...`;
			}
			return 'For the borrower\'s privacy, this loan has been made anonymous.';
		},
	},
	created() {
		// Check if new funded borrower profile experiment is active.
		const { enabled } = getExperimentSettingCached(this.apollo, newFundedBorrowerPageExpKey);
		const exp = this.apollo.readFragment({
			id: `Experiment:${newFundedBorrowerPageExpKey}`,
			fragment: experimentVersionFragment,
		}) ?? {};
		if (enabled && exp.version === 'b') {
			this.enabledExperiment = true;
		}

		if (this.$route.query?.utm_campaign?.includes('scle')) {
			// EXP-MARS-143-Jul2022
			// Extract exp version from utm_campaign
			this.shareCardLanguageVersion = this.$route.query?.utm_campaign?.split('_')?.pop()?.replace('-normal', '');
			this.$kvTrackEvent(
				'Thanks',
				'EXP-MARS-143-Jul2022',
				this.shareCardLanguageVersion.replace('-normal', '')
			);
		}
	},
	mounted() {
		const { enabled } = getExperimentSettingCached(this.apollo, newFundedBorrowerPageExpKey);
		if (enabled) {
			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Funded borrower profile',
				newFundedBorrowerPageExpKey,
				'EXP-MARS-127-Jun2022'
			);
		}
		if (this.enabledExperiment) {
			this.createViewportObserver();
			this.rows = [
				{
					heading: 'Support these ',
					subHeading: '',
					onlyLoan: false,
					limit: 3,
					filter: { sector: { eq: this.loan?.sector?.name } },
					loanIds: []
				},
				{
					heading: 'Recommended Borrower',
					subHeading: 'We selected this loan for you because it\'s similar to ',
					onlyLoan: true,
					limit: 1,
					filter: null,
					loan: null
				},
				{
					heading: 'Support these ',
					subHeading: '',
					onlyLoan: false,
					limit: 3,
					filter: { gender: { eq: this.loan?.gender } },
					loanIds: []
				},
				{
					heading: 'Support these borrowers in ',
					subHeading: '',
					onlyLoan: false,
					limit: 3,
					filter: { countryIsoCode: { eq: this.loan?.geocode?.country?.isoCode } },
					loanIds: []
				},
			];
		}
	},
	methods: {
		refIsVisible() {
			const { top, bottom } = this.$refs?.preBottom?.getBoundingClientRect() ?? {};
			const vHeight = (window.innerHeight || document.documentElement.clientHeight);
			return (
				(top > 0 || bottom > 0)
				&& top < vHeight
			);
		},
		fetchLoanData() {
			const row = this.rows.shift();
			if (row) {
				this.isLoading = true;
				if (!row.onlyLoan) {
					try {
						const variables = {
							limit: row.limit,
							filters: [
								row.filter
							],
							origin: FLSS_ORIGIN_BP_FUNDED
						};

						this.apollo.query({
							query: personalizedLoansQuery,
							variables,
						}).then(({ data }) => {
							const personalizedLoans = data?.fundraisingLoans?.values ?? [];
							if (!personalizedLoans.length) {
								this.isLoading = false;
								return this.fetchLoanData();
							}
							const personalizedLoanIds = personalizedLoans.map(element => element.id);
							let finalHeading = '';
							let expLabel = '';
							if (row?.filter?.gender) {
								finalHeading = this.loan?.gender.includes('female') ? 'women' : 'men';
								expLabel = this.loan?.gender;
							}
							if (row?.filter?.countryIsoCode) {
								finalHeading = this.loan?.geocode?.country?.name;
								expLabel = this.loan?.geocode?.country?.isoCode;
							}
							if (row?.filter?.sector) {
								finalHeading = `${this.loan?.sector?.name} loans`;
								expLabel = String(this.loan?.sector?.id);
							}
							this.categories = [
								...this.categories, {
									heading: row.heading + finalHeading,
									subHeading: row.subHeading,
									loanIds: personalizedLoanIds,
									loan: null,
									expLabel
								}
							];
							this.isLoading = false;
							if (this.refIsVisible()) {
								this.fetchLoanData();
							}
						});
					} catch (e) {
						logReadQueryError(e, 'FundedBorrowerProfile personalizedLoansQuery');
						this.isLoading = false;
					}
				} else {
					try {
						return this.apollo.query({
							query: mlLoansYouMightLikeData,
							variables: {
								loanId: parseInt(this.loan.id, 10),
								limit: row.limit
							}
						}).then(data => {
							const loans = _get(data, 'data.ml.relatedLoansByTopics[0].values');
							this.categories = [
								...this.categories,
								{
									heading: row.heading, loan: loans[0], loanIds: [], subHeading: row.subHeading
								}
							];
							this.isLoading = false;
							if (this.refIsVisible()) {
								this.fetchLoanData();
							}
						});
					} catch (e) {
						logReadQueryError(e, 'FundedBorrowerProfile mlLoansYouMightLikeData');
						this.isLoading = false;
					}
				}
			}
		},
		createViewportObserver() {
			this.viewportObserver = createIntersectionObserver({
				targets: [this.$refs.preBottom],
				callback: entries => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							this.fetchLoanData();
						}
					});
				}
			});
			if (!this.viewportObserver) {
				Array.from({ length: this.loanRowsCount }).map(() => this.fetchLoanData());
			}
		},
		destroyViewportObserver() {
			if (this.viewportObserver) {
				this.viewportObserver.disconnect();
			}
		},
	},
	beforeDestroy() {
		this.destroyViewportObserver();
	},
};
</script>

<style lang="scss">
@import 'settings';

.loans-container {
	max-width: 67rem;
}

.borrower-profile-wrapper {
	padding-top: 1rem;
}

.loan-location-flag {
	display: inline-block;
	width: rem-calc(16);
	margin-right: 0.25rem;
}

.loan-description-wrapper {
	padding-bottom: 1.25rem;
}

.lyml-wrapper {
	padding: 1.25rem 0;
}

#loading-overlay {
	position: relative;
	width: auto;
	height: auto;
	left: 1rem;
	right: 1rem;
	bottom: 0;
	top: 0;
	min-height: 6rem;

	.spinner-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		height: 100%;
		top: auto;
		left: auto;
		transform: none;
		transition: top 100ms linear;
	}
}

</style>
