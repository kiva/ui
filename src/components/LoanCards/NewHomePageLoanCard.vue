<template>
	<div
		class="tw-flex tw-flex-col card-container selected-card tw-rounded-xs"
		:id="`${loanId}-loan-card`"
	>
		<router-link
			class="link"
			:is="allSharesReserved ? 'span' : 'router-link'"
			:to="`/lend/${loanId}`"
			v-kv-track-event="['Lending', 'click-see more', 'card', loanId]"
		>
			<!-- Borrower image w/ location <summary-tag> -->
			<kv-loading-placeholder
				v-if="isLoading"
				class="tw-mb-1 tw-rounded" :style="{width: '240px', height: '180px'}"
			/>
			<div
				v-if="!isLoading"
				class="tw-relative"
			>
				<!-- If allSharesReserved, disable link by making it a span -->
				<borrower-image
					class="
					tw-relative
					tw-w-full
					tw-bg-black
					tw-rounded
				"
					:alt="'photo of ' + borrowerName"
					:aspect-ratio="3 / 4"
					:default-image="{ width: 336 }"
					:hash="imageHash"
					:images="[
						{ width: 336, viewSize: 1024 },
						{ width: 336, viewSize: 768 },
						{ width: 416, viewSize: 480 },
						{ width: 374, viewSize: 414 },
						{ width: 335, viewSize: 375 },
						{ width: 280 },
					]"
				/>
				<div v-if="countryName">
					<summary-tag
						class="tw-absolute tw-bottom-2 tw-left-1 tw-text-primary"
						:country-name="countryName"
					>
						<kv-material-icon
							class="tw-h-2.5 tw-w-2.5 tw-mr-0.5"
							:icon="mdiMapMarker"
						/>
						{{ countryName }}
					</summary-tag>
				</div>
			</div>

			<!-- Borrower name-->
			<kv-loading-placeholder
				v-if="isLoading"
				class="tw-mb-0.5" style="height: 2rem;"
			/>

			<borrower-name
				v-if="!isLoading"
				class="tw-mb-1 tw-text-h3 tw-mt-1 tw-overflow-hidden tw-text-ellipsis tw-line-clamp-1"
				:max-length="50"
				:name="borrowerName"
				style="min-height: 2rem;"
			/>

			<!-- LoanUse  -->
			<kv-loading-paragraph
				v-if="isLoading"
				class="tw-mb-1.5 tw-flex-grow"
				style="min-height: 1rem;"
			/>
			<div v-if="!isLoading" class="tw-text-left">
				<p class="tw-m-0 tw-overflow-hidden tw-text-ellipsis tw-line-clamp-2 tw-text-md loan-use">
					{{ loanUse }}
				</p>
			</div>

			<!-- Amount to go line-->
			<kv-loading-placeholder
				v-if="isLoading"
				class="tw-mb-0.5" style="height: 1.3rem;"
			/>

			<!-- Fundraising bar -->
			<kv-loading-placeholder
				v-if="isLoading"
				class="tw-mb-1.5 tw-rounded" :style="{height: '0.5rem'}"
			/>

			<div v-if="!isLoading" class="tw-flex-auto tw-mb-2">
				<figure>
					<figcaption class="tw-flex">
						<div class="tw-flex-auto tw-text-left">
							<p
								class="tw-text-h3 tw-m-0 progress-text tw-mb-2 tw-mt-2"
								data-testid="bp-summary-amount-to-go"
							>
								{{ Math.floor(fundraisingPercent) }}% FUNDED
							</p>
						</div>
						<p
							class="tw-flex-auto tw-text-right progress-text tw-mb-2 tw-mt-2"
							data-testid="bp-summary-timeleft"
						>
							<span lass="tw-text-h3 tw-block tw-m-0">
								{{ $filters.numeral(loanAmount, '$0,0[.]00') }}
							</span>
						</p>
					</figcaption>
					<kv-progress-bar
						v-if="!isLoading"
						class="tw-mb-1.5 lg:tw-mb-1 tw-bg-tertiary"
						label="Percent the loan has funded"
						:value="fundraisingPercent"
					/>
				</figure>
			</div>
		</router-link>
		<div v-if="dedications.length > 0">
			💚
			<button
				class="data-hj-suppress tw-capitalize tw-text-action hover:tw-underline"
				@click="dedicationClickEvent"
			>
				{{ dedicationsCopy }}
			</button>
		</div>
	</div>
</template>

<script>
import { mdiMapMarker } from '@mdi/js';
import { gql } from 'graphql-tag';
import * as Sentry from '@sentry/vue';
import percentRaisedMixin from '#src/plugins/loan/percent-raised-mixin';
import timeLeftMixin from '#src/plugins/loan/time-left-mixin';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import BorrowerName from '#src/components/BorrowerProfile/BorrowerName';
import KvLoadingParagraph from '#src/components/Kv/KvLoadingParagraph';
import { readLoanFragment, watchLoanCardData } from '#src/util/loanUtils';
import { createIntersectionObserver } from '#src/util/observerUtils';
import SummaryTag from '#src/components/BorrowerProfile/SummaryTag';
import { KvLoadingPlaceholder, KvProgressBar, KvMaterialIcon } from '@kiva/kv-components';

export const loanFieldsFragment = gql`
	fragment loanFields on LoanBasic {
		id
		distributionModel
		geocode {
			country {
				id
				name
			}
		}
		image {
			id
			hash
		}
		name
		use
		loanAmount
		loanFundraisingInfo {
			id
			fundedAmount
			reservedAmount
		}
		fundraisingPercent @client
		dedicationToKiva(publicId: $publicId)
		dedications(publicId: $publicId) {
			values {
				id
				recipientName
			}
		}
	}`;

const loanCardQuery = gql`
	${loanFieldsFragment}
	query welcomeLoanCard($loanId: Int!, $publicId: String!) {
		lend {
			loan(id: $loanId) {
				id
				...loanFields
			}
		}
	}`;

export default {
	name: 'NewHomePageLoanCard',
	emits: ['dedication-click'],
	props: {
		loanId: {
			type: Number,
			required: true,
		},
		lenderPublicId: {
			type: String,
			default: '',
		}
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [percentRaisedMixin, timeLeftMixin],
	components: {
		BorrowerImage,
		BorrowerName,
		KvLoadingPlaceholder,
		KvLoadingParagraph,
		KvMaterialIcon,
		SummaryTag,
		KvProgressBar
	},
	data() {
		return {
			loan: null,
			mdiMapMarker,
			isLoading: true,
			queryObserver: null,
			viewportObserver: null,
		};
	},
	computed: {
		borrowerName() {
			return this.loan?.name || '';
		},
		countryISO() {
			return this.loan?.geocode?.country?.isoCode || '';
		},
		countryName() {
			return this.loan?.geocode?.country?.name || '';
		},
		distributionModel() {
			return this.loan?.distributionModel || '';
		},
		imageHash() {
			return this.loan?.image?.hash ?? '';
		},
		loanUse() {
			if (this.loan?.distributionModel === 'direct') {
				return `Loan for ${this.loan?.use}`;
			}
			return `Loan ${this.loan?.use}`;
		},
		fundraisingPercent() {
			if (this.loan?.distributionModel) {
				return (this.loan?.fundraisingPercent ?? 0) * 100;
			}
			return 0;
		},
		unreservedAmount() {
			return this.loan?.unreservedAmount ?? '0';
		},
		timeLeft() {
			return this.loan?.fundraisingTimeLeft ?? '';
		},
		allSharesReserved() {
			if (parseFloat(this.loan?.unreservedAmount) === 0) {
				return true;
			}
			return false;
		},
		inBorrowerProfilePage() {
			return this.$route.path.includes('funded');
		},
		loanAmount() {
			return this.loan?.loanAmount;
		},
		dedications() {
			const dedications = this.loan?.dedications?.values ?? [];
			const dedicationToKiva = this.loan?.dedicationToKiva ?? false;
			if (dedicationToKiva) {
				dedications.push({
					recipientName: 'Kiva',
				});
			}
			return dedications;
		},
		dedicationsCopy() {
			return this.dedications.length > 1
				? 'Multiple recipients'
				: this.dedications[0].recipientName;
		},
	},
	methods: {
		createViewportObserver() {
			// Watch for this element being in the viewport
			this.viewportObserver = createIntersectionObserver({
				targets: [this.$el],
				callback: entries => {
					entries.forEach(entry => {
						if (entry.target === this.$el && entry.intersectionRatio > 0) {
							// This element is in the viewport, so load the data.
							this.loadData();
						}
					});
				}
			});
			if (!this.viewportObserver) {
				// Observer was not created, so call loadData right away as a fallback.
				this.loadData();
			}
		},
		destroyViewportObserver() {
			if (this.viewportObserver) {
				this.viewportObserver.disconnect();
			}
		},
		loadData() {
			if (!this.queryObserver) {
				this.queryObserver = watchLoanCardData({
					apollo: this.apollo,
					loanId: this.loanId,
					publicId: this.lenderPublicId,
					loanCardQuery,
					callback: result => this.processQueryResult(result),
				});
			}
		},
		processQueryResult(result) {
			if (result.error) {
				this.$showTipMsg('There was a problem loading your loan recommendations', 'error');
				try {
					Sentry.withScope(scope => {
						scope.setTag('wizard_stage', 'results');
						scope.setTag('loan_id', this.loanId);
						Sentry.captureException(result.error);
					});
				} catch (e) {
					// no-op
				}
			}

			this.loan = result.data?.lend?.loan || null;
			if (this.loan) {
				this.isLoading = false;
			}
		},
		dedicationClickEvent() {
			this.$emit('dedication-click', { loanId: this.loanId, dedicationCopy: this.dedicationsCopy });
			this.$router.push(`/dedication/${this.loanId}`);
		},
	},
	created() {
		// Use cached loan data if it exists
		const cachedLoan = readLoanFragment({
			apollo: this.apollo,
			loanId: this.loanId,
			publicId: this.lenderPublicId,
			fragment: loanFieldsFragment,
		});
		if (cachedLoan) {
			this.loan = cachedLoan;
			this.isLoading = false;
		}
	},
	mounted() {
		if (this.loan) {
			// Already have a loan, so only setup watch query to handle changes in data
			this.loadData();
		} else {
			// Don't have a loan yet, so setup viewport observer to prepare async loading
			this.createViewportObserver();
		}
	},
	beforeUnmount() {
		this.destroyViewportObserver();
	},
	watch: {
		// When loan id changes, update watch query variables
		loanId(loanId) {
			if (this.queryObserver) {
				this.queryObserver.setVariables({
					loanId,
					publicId: this.lenderPublicId,
				});
			}
		},
	},
};
</script>

<style lang="postcss" scoped>

.link {
	@apply tw-no-underline tw-text-black hover:tw-no-underline;
}

.card-container {
	min-width: 242px;
	max-width: 242px;
	height: 100%;
	padding: 10px;
}

.selected-card {
	@apply tw-inline-block tw-transition-all tw-duration-300 tw-ease-in-out;
}

.selected-card:hover {
	box-shadow: 0 4px 10px rgb(0 0 0 / 5%);
}

.progress-text {
	@apply tw-text-small tw-text-black tw-font-medium;
}

.borrower-name {
	margin-top: 10px;
}

.loan-use {
	min-height: 51px;
}

.loading-placeholder {
	min-width: 242px;
	max-width: 242px;
}

.loading-paragraph {
	min-width: 242px;
	max-width: 242px;
}
</style>
