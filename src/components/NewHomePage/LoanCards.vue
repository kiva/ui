<template>
	<div
		class="tw-flex tw-flex-col card-container"
		:id="`${loanId}-loan-card`"
	>
		<router-link
			class="link"
			:is="allSharesReserved ? 'span' : 'router-link'"
			:to="`/lend-beta/${loanId}`"
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
						:city="city"
						:state="state"
						:country-name="countryName"
					>
						<kv-material-icon
							class="tw-h-2.5 tw-w-2.5 tw-mr-0.5"
							:icon="mdiMapMarker"
						/>
						{{ formattedLocation }}
					</summary-tag>
				</div>
			</div>

			<!-- Borrower name-->
			<kv-loading-placeholder
				v-if="isLoading"
				class="tw-mb-0.5 borrower-name" style="min-height: 2rem;"
			/>

			<borrower-name
				v-if="!isLoading"
				class="tw-mb-1 tw-text-h3 borrower-name"
				:max-length="50"
				:name="borrowerName"
				style="min-height: 2rem;"
			/>

			<!-- LoanUse  -->
			<kv-loading-paragraph
				v-if="isLoading"
				class="tw-mb-1.5 tw-flex-grow"
			/>
			<div v-if="!isLoading" class="loan-use-container">
				<p class="tw-text-h3 tw-m-0 loan-use-text tw-mb-2.5">
					{{ loanUse }}
				</p>
			</div>

			<!-- Amount to go line-->
			<kv-loading-placeholder
				v-if="isLoading"
				class="tw-mb-0.5" style="width: 100%; height: 1.3rem;"
			/>

			<!-- Fundraising bar -->
			<kv-loading-placeholder
				v-if="isLoading"
				class="tw-mb-1.5 tw-rounded" :style="{width: '100%', height: '0.5rem'}"
			/>

			<div v-if="!isLoading" class="tw-flex-auto tw-mb-2">
				<figure>
					<figcaption class="tw-flex progress">
						<template>
							<div class="tw-flex-auto tw-text-left">
								<p
									class="tw-text-h3 tw-m-0 progress__to-go"
									data-testid="bp-summary-amount-to-go"
								>
									{{ Math.floor(fundraisingPercent) }}% FUNDED
								</p>
							</div>
							<p
								class="tw-flex-auto tw-text-right progress__days-remaining"
								data-testid="bp-summary-timeleft"
							>
								<span lass="tw-text-h3 tw-block tw-m-0">
									{{ loanAmount | numeral('$0,0[.]00') }}
								</span>
							</p>
						</template>
					</figcaption>
					<kv-progress-bar
						v-if="!isLoading"
						class="tw-mb-1.5 lg:tw-mb-1 tw-bg-tertiary"
						aria-label="Percent the loan has funded"
						:value="fundraisingPercent"
					/>
				</figure>
			</div>
		</router-link>
	</div>
</template>

<script>
import { mdiMapMarker } from '@mdi/js';
import gql from 'graphql-tag';
import * as Sentry from '@sentry/vue';
import LoanUse from '@/components/BorrowerProfile/LoanUse';
import percentRaisedMixin from '@/plugins/loan/percent-raised-mixin';
import timeLeftMixin from '@/plugins/loan/time-left-mixin';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import BorrowerName from '@/components/BorrowerProfile/BorrowerName';
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import KvLoadingParagraph from '@/components/Kv/KvLoadingParagraph';
import { watchLoanCardData } from '@/util/loanUtils';
import { createIntersectionObserver } from '@/util/observerUtils';
import SummaryTag from '@/components/BorrowerProfile/SummaryTag';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const loanCardQuery = gql`query welcomeLoanCard($loanId: Int!) {
	lend {
		loan(id: $loanId) {
			id
			distributionModel
			geocode {
				country {
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
				fundedAmount
				reservedAmount
			}
			fundraisingPercent @client
		}
	}
}`;

export default {
	name: 'LoanCards',
	props: {
		loanId: {
			type: Number,
			required: true,
		}
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [percentRaisedMixin, timeLeftMixin],
	components: {
		BorrowerImage,
		BorrowerName,
		KvLoadingPlaceholder,
		KvLoadingParagraph,
		LoanUse,
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
		city() {
			return this.loan?.geocode?.city || '';
		},
		state() {
			return this.loan?.geocode?.state || '';
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
				return this.loan?.fundraisingPercent * 100;
			}
			return 0;
		},
		unreservedAmount() {
			return this.loan?.unreservedAmount ?? '0';
		},
		timeLeft() {
			return this.loan?.fundraisingTimeLeft ?? '';
		},
		formattedLocation() {
			if (this.distributionModel === 'direct') {
				const formattedString = `${this.city}, ${this.state}, ${this.countryName}`;
				return formattedString;
			}
			if (this.countryName === 'Puerto Rico') {
				const formattedString = `${this.city}, PR`;
				return formattedString;
			}
			return this.countryName;
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

			this.isLoading = false;
			this.loan = result.data?.lend?.loan || null;
		},
	},
	mounted() {
		this.createViewportObserver();
	},
	beforeDestroy() {
		this.destroyViewportObserver();
	},
	watch: {
		// When loan id changes, update watch query variables
		loanId(loanId) {
			if (this.queryObserver) {
				this.queryObserver.setVariables({
					loanId,
				});
			}
		},
	},
};
</script>
<style lang="scss" scoped>
@import 'settings';
@import "foundation";

$color-text: #212121;
$background-color: #fff;

.link {
	color: $color-text;
	text-decoration: none;
}

.card-container {
	min-width: 260px;
	max-width: 260px;
	height: 100%;
	padding: 10px;
	display: inline-block;
	background-color: $background-color;
	border-radius: 8px;
	-webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
	transition: opacity 0.3s ease-in-out;
}

.card-container:hover {
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.progress {
	&__to-go {
		font-size: 14px;
		margin-top: 15px;
		margin-bottom: 5px;
		color: #212121;
		font-weight: bold;
	}

	&__days-remaining {
		font-size: 14px;
		margin-top: 15px;
		margin-bottom: 5px;
		color: $color-text;
		text-transform: uppercase;
		font-weight: bold;
	}
}

.borrower-name {
	font-size: 1.5rem;
	margin-top: 10px;
}

.loan-use-container {
	text-align: left;
	line-height: 1.5em;
	max-height: 3em;
	margin-bottom: 0;
}

.loan-use-text {
	font-size: 17px;
	font-weight: 300;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	letter-spacing: -0.3px;
	margin-bottom: 0;
}
</style>
