<template>
	<div>
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
											:progress-percent="progressPercent"
											:loan-status="loanStatus"
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
						:row-number="index + 1"
						:is-visitor="isVisitor"
					/>
				</div>
			</div>
		</article>
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
import logReadQueryError from '#src/util/logReadQueryError';
import KvLoadingSpinner from '#src/components/Kv/KvLoadingSpinner';
import { createIntersectionObserver } from '#src/util/observerUtils';
import HeroBackground from '#src/components/BorrowerProfile/HeroBackground';
import BorrowerName from '#src/components/BorrowerProfile/BorrowerName';
import LoanProgress from '#src/components/BorrowerProfile/LoanProgress';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import KivaClassicLoanCarousel from '#src/components/LoanCollections/KivaClassicLoanCarousel';
import personalizedLoansQuery from '#src/graphql/query/lendByCategory/personalizedLoans.graphql';
import mlLoansYouMightLikeData from '#src/graphql/query/loansYouMightLike/mlLoansYouMightLikeData.graphql';
import LoanCardController from '#src/components/LoanCards/LoanCardController';
import { FLSS_ORIGIN_BP_FUNDED } from '#src/util/flssUtils';
import { KvGrid, KvPageContainer } from '@kiva/kv-components';

export default {
	name: 'FundedBorrowerProfile',
	head() {
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
		};
	},
	computed: {
		shareTitle() {
			if (this.loan?.anonymizationLevel !== 'full') {
				return `A loan of $${this.loan?.loanAmount} made a difference for ${this.loan.name}`;
			}
			return `A loan of $${this.loan?.loanAmount} made a difference`;
		},
		shareDescription() {
			// eslint-disable-next-line max-len
			return 'Kiva is a loan, not a donation. With Kiva you can lend as little as $25 and make a big change in someone\'s life.';
		},
		loanStatus() {
			// Loan may still be fundraising, but all shares are reserved
			if (this.loan?.status === 'fundraising') {
				return 'funded';
			}
			return this.loan?.status ?? 'funded';
		},
		progressPercent() {
			if (this.loanStatus === 'funded') {
				return 1;
			}
			return (this.loan?.loanFundraisingInfo?.fundedAmount ?? 0) / (this.loan?.loanAmount ?? 0);
		},
	},
	mounted() {
		this.createViewportObserver();
		this.rows = [
			{
				identifier: 'sector',
				rowIndex: 1,
				heading: 'Support these ',
				subHeading: '',
				onlyLoan: false,
				limit: 3,
				filter: { sector: { eq: this.loan?.sector?.name } },
				loanIds: []
			},
			{
				identifier: 'recommended',
				rowIndex: 2,
				heading: 'Recommended Borrower',
				subHeading: 'We selected this loan for you because it\'s similar to ',
				onlyLoan: true,
				limit: 1,
				filter: null,
				loan: null
			},
			{
				identifier: 'gender',
				rowIndex: 3,
				heading: 'Support these ',
				subHeading: '',
				onlyLoan: false,
				limit: 3,
				filter: { gender: { eq: this.loan?.gender } },
				loanIds: []
			},
			{
				identifier: 'country',
				rowIndex: 4,
				heading: 'Support these borrowers in ',
				subHeading: '',
				onlyLoan: false,
				limit: 3,
				filter: { countryIsoCode: { eq: this.loan?.geocode?.country?.isoCode } },
				loanIds: []
			},
		];
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
		trackDisplayedLoans(sectionIdentifier, sectionPosition, loans) {
			const loansDisplayed = loans?.filter(l => !!l?.id)?.map((l, i) => ({
				position: i + 1,
				loanId: l.id,
			})) ?? [];

			if (loansDisplayed.length) {
				const event = {
					// eslint-disable-next-line max-len
					schema: 'https://raw.githubusercontent.com/kiva/snowplow/master/conf/snowplow_lend_by_category_loan_display_event_v3_schema_1_0_0.json#',
					data: {
						sectionIdentifier,
						sectionPosition,
						loansDisplayed,
					},
				};

				this.$kvTrackSelfDescribingEvent(event);
			}
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
							this.trackDisplayedLoans(row.identifier, row.rowIndex, personalizedLoans);
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
						}).then(({ data }) => {
							const loan = (data?.ml?.relatedLoansByTopics?.[0]?.values ?? [])[0];
							this.categories = [
								...this.categories,
								{
									heading: row.heading, loan, loanIds: [], subHeading: row.subHeading
								}
							];
							this.trackDisplayedLoans(row.identifier, row.rowIndex, [loan]);
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
	beforeUnmount() {
		this.destroyViewportObserver();
	},
};
</script>

<style lang="scss">
@use '#src/assets/scss/settings' as *;

.loans-container {
	max-width: 67rem;
}

#loading-overlay {
	position: relative;
	width: auto;
	height: auto;
	inset: 0 1rem;
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
