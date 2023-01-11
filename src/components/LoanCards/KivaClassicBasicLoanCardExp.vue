<template>
	<div
		class="tw-flex tw-flex-col"
		style="min-width: 230px; max-width: 374px; height: 100%;"
		:id="`${loanId}-loan-card`"
	>
		<!-- Borrower image w/ location <summary-tag> -->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-mb-1 tw-rounded" :style="{width: '100%', height: '15.75rem'}"
		/>
		<div
			v-if="!isLoading"
			class="tw-relative"
		>
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
					class="tw-absolute tw-bottom-2 tw-right-1 tw-text-primary"
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
			class="tw-mb-0.5" :style="{width: 75 + (Math.random() * 15) + '%', height: '1.875rem'}"
		/>

		<borrower-name
			v-if="!isLoading"
			class="tw-mb-1 tw-text-h3"
			:max-length="50"
			:name="borrowerName"
			style="min-height: 3rem;"
		/>

		<!-- LoanUse  -->
		<kv-loading-paragraph
			v-if="isLoading"
			class="tw-mb-1.5 tw-flex-grow" :style="{width: '100%', height: '5.5rem'}"
		/>

		<loan-use
			v-if="!isLoading"
			class="tw-mb-2.5 tw-flex-grow"
			:loan-use-max-length="52"
			:loan-id="`${allSharesReserved ? '' : loanId}`"
			:use="loan.use"
			:name="borrowerName"
			:status="loan.status"
			:loan-amount="loan.loanAmount"
			:borrower-count="loan.borrowerCount"
			:show-learn-more="false"
		/>
	</div>
</template>

<script>
import { mdiChevronRight, mdiMapMarker } from '@mdi/js';
import { gql } from '@apollo/client';
import * as Sentry from '@sentry/vue';
import { isMatchAtRisk, watchLoanData } from '@/util/loanUtils';
import { createIntersectionObserver } from '@/util/observerUtils';
import LoanUse from '@/components/BorrowerProfile/LoanUse';
import percentRaisedMixin from '@/plugins/loan/percent-raised-mixin';
import timeLeftMixin from '@/plugins/loan/time-left-mixin';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import BorrowerName from '@/components/BorrowerProfile/BorrowerName';
import KvLoadingParagraph from '@/components/Kv/KvLoadingParagraph';
import SummaryTag from '@/components/BorrowerProfile/SummaryTag';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const loanQuery = gql`query kcBasicLoanCard($loanId: Int!) {
	lend {
		loan(id: $loanId) {
			id
			distributionModel
			geocode {
				city
				state
				country {
					name
					isoCode
				}
			}
			image {
				id
				hash
			}
			name

			# for loan-use-mixin
			use
			status
			loanAmount
			borrowerCount

		}
	}
}`;

export default {
	name: 'KivaClassicBasicLoanCardExp',
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
	},
	data() {
		return {
			loan: null,
			basketItems: null,
			isLoading: true,
			queryObserver: null,
			mdiChevronRight,
			mdiMapMarker,
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
		isInBasket() {
			if (!Array.isArray(this.basketItems)) {
				return false;
			}
			// eslint-disable-next-line no-underscore-dangle
			const loanItems = this.basketItems.filter(item => item.__typename === 'LoanReservation');
			const loanIds = loanItems.map(loan => loan.id);
			return loanIds.indexOf(this.loanId) > -1;
		},
		isMatchAtRisk() {
			return isMatchAtRisk(this.loan);
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
				this.queryObserver = watchLoanData({
					apollo: this.apollo,
					cookieStore: this.cookieStore,
					loanId: this.loanId,
					loanQuery,
					callback: result => this.processQueryResult(result),
				});
			}
		},
		processQueryResult(result) {
			if (result.error) {
				console.error(result.error);
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
			this.loan = result.data?.lend?.loan ?? {};
			this.basketItems = result.data?.shop?.basket?.items?.values ?? [];
		}
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
					basketId: this.cookieStore.get('kvbskt'),
					loanId,
				});
			}
		},
	},
};
</script>
