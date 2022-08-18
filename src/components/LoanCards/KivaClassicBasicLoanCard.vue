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
			<!-- If allSharesReserved, disable link by making it a span -->
			<router-link
				:is="allSharesReserved ? 'span' : 'router-link'"
				:to="`/lend/${loanId}`"
				v-kv-track-event="['Lending', 'click-Read more', 'Photo', loanId]"
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
			</router-link>
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

		<!-- Amount to go line-->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-mb-0.5" :style="{width: 40 + (Math.random() * 15) + '%', height: '1.3rem'}"
		/>

		<!-- Fundraising bar -->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-mb-1.5 tw-rounded" :style="{width: '100%', height: '0.5rem'}"
		/>

		<!-- Contains amount to go and fundraising bar -->
		<loan-progress-group
			v-if="!isLoading"
			class="tw-mb-2.5"
			:money-left="unreservedAmount"
			:progress-percent="fundraisingPercent"
			:time-left="timeLeftMessage"
			:all-shares-reserved="allSharesReserved"
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
		/>

		<!-- Matching text  -->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-mb-1" :style="{width: 75 + (Math.random() * 15) + '%', height: '1.3rem'}"
		/>

		<loan-matching-text
			v-if="!isLoading && loan.matchingText !== '' && !isMatchAtRisk"
			class="tw-mb-1.5"
			:matcher-name="loan.matchingText"
			:match-ratio="loan.matchRatio"
			:status="loan.status"
			:funded-amount="loan.loanFundraisingInfo.fundedAmount"
			:reserved-amount="loan.loanFundraisingInfo.reservedAmount"
			:loan-amount="loan.loanAmount"
		/>

		<!-- CTA Button -->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-rounded tw-self-start" :style="{width: '9rem', height: '3rem'}"
		/>

		<kv-ui-button
			v-if="!isLoading && !allSharesReserved && !showLendNowButton"
			class="tw-mb-2 tw-self-start"
			:state="`${allSharesReserved ? 'disabled' : ''}`"
			:to="`/lend/${loanId}`"
			v-kv-track-event="['Lending', 'click-Read-more', 'View loan', loanId]"
		>
			View loan
			<kv-material-icon
				class="tw-w-3 tw-h-3 tw-align-middle"
				:icon="mdiChevronRight"
			/>
		</kv-ui-button>

		<!-- Template wrapper for different states of the "lend now" button -->
		<template v-if="showLendNowButton">
			<kv-ui-button
				class="tw-text-secondary"
				variant="secondary"
				v-if="isInBasket"
				v-kv-track-event="['Lending', 'click-Read more', 'checkout-now-button-click', loanId, loanId]"
				to="/basket"
			>
				<slot>
					<div class="tw-inline-flex tw-items-center tw-gap-1">
						Checkout now
						<kv-material-icon
							class="tw-w-2.5 tw-h-2.5"
							:icon="mdiCheckCircleOutline"
						/>
					</div>
				</slot>
			</kv-ui-button>

			<!-- Lend button -->
			<kv-ui-button
				key="lendButton"
				v-if="!allSharesReserved && !isLoading && !isAdding && !isInBasket"
				class="tw-inline-flex tw-flex-1"
				data-testid="bp-lend-cta-lend-button"
				type="submit"
				@click="addToBasket"
				v-kv-track-event="[
					'Lending',
					'lend-button-loan-upsell',
					expLabel
				]"
			>
				{{ ctaButtonText }}
			</kv-ui-button>

			<kv-ui-button
				v-if="isAdding"
				class="tw-inline-flex tw-flex-1"
				data-testid="bp-lend-cta-adding-to-basket-button"
			>
				Adding to basket...
			</kv-ui-button>
		</template>
		<!-- If allSharesReserved show message and hide cta button -->
		<div
			v-if="allSharesReserved"
			class="
				tw-rounded
				tw-bg-secondary
				tw-text-center
				tw-w-full
				tw-py-1 tw-px-1.5
				tw-mb-2 tw-mt-2
			"
		>
			Another lender has selected this loan. Please choose a different borrower to support.
		</div>
	</div>
</template>

<script>
import { mdiChevronRight, mdiMapMarker, mdiCheckCircleOutline } from '@mdi/js';
import gql from 'graphql-tag';
import * as Sentry from '@sentry/vue';
import { isMatchAtRisk, watchLoanData } from '@/util/loanUtils';
import { createIntersectionObserver } from '@/util/observerUtils';
import LoanUse from '@/components/BorrowerProfile/LoanUse';
import percentRaisedMixin from '@/plugins/loan/percent-raised-mixin';
import timeLeftMixin from '@/plugins/loan/time-left-mixin';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import BorrowerName from '@/components/BorrowerProfile/BorrowerName';
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import KvLoadingParagraph from '@/components/Kv/KvLoadingParagraph';
import LoanProgressGroup from '@/components/LoanCards/LoanProgressGroup';
import LoanMatchingText from '@/components/LoanCards/LoanMatchingText';
import SummaryTag from '@/components/BorrowerProfile/SummaryTag';
import { setLendAmount } from '@/util/basketUtils';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvUiButton from '~/@kiva/kv-components/vue/KvButton';

const loanQuery = gql`query kcBasicLoanCard($basketId: String, $loanId: Int!) {
	shop (basketId: $basketId) {
		id
		basket {
			id
			# for isInBasket
			items {
				values {
					id
				}
			}
		}
	}
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
			sector {
				id
				name
			}
			whySpecial

			# for isLentTo
			userProperties {
				lentTo
			}

			# for loan-use-mixin
			use
			status
			loanAmount
			borrowerCount

			# for percent-raised-mixin
			loanFundraisingInfo {
				fundedAmount
				reservedAmount
			}

			# for time-left-mixin
			plannedExpirationDate

			# for loan-progress component
			unreservedAmount @client
			fundraisingPercent @client
			fundraisingTimeLeft @client

			# for matching-text component
			isMatchable
			matchingText
			matchRatio
		}
	}
}`;

export default {
	name: 'KivaClassicBasicLoanCard',
	props: {
		loanId: {
			type: Number,
			required: true,
		},
		expLabel: {
			type: String,
			default: ''
		},
		lendNowButton: {
			type: Boolean,
			default: false
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
		LoanProgressGroup,
		LoanMatchingText,
		KvMaterialIcon,
		SummaryTag,
		KvUiButton
	},
	data() {
		return {
			mdiCheckCircleOutline,
			loan: null,
			basketItems: null,
			isLoading: true,
			queryObserver: null,
			mdiChevronRight,
			mdiMapMarker,
			viewportObserver: null,
			isAdding: false
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
		isLentTo() {
			return this.loan?.userProperties?.lentTo;
		},
		isMatchAtRisk() {
			return isMatchAtRisk(this.loan);
		},
		sectorName() {
			return (this.loan?.sector?.name || '').toLowerCase();
		},
		whySpecial() {
			const text = this.loan?.whySpecial || '';
			return text.toString().charAt(0).toLowerCase() + text.toString().slice(1);
		},
		fundraisingPercent() {
			return this.loan?.fundraisingPercent ?? 0;
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
		isLessThan25() {
			return this.unreservedAmount < 25 && this.unreservedAmount > 0;
		},
		inBorrowerProfilePage() {
			return this.$route.path.includes('funded');
		},
		lendAmount() {
			return this.isLessThan25 ? this.unreservedAmount : 25;
		},
		ctaButtonText() {
			return `Lend $${this.lendAmount} now`;
		},
		// TODO refactor this when inBorrowerProfilePage is removed.
		showLendNowButton() {
			return this.inBorrowerProfilePage || this.lendNowButton;
		}
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
			this.loan = result.data?.lend?.loan || null;
			this.basketItems = result.data?.shop?.basket?.items?.values || null;
		},
		addToBasket() {
			this.isAdding = true;
			setLendAmount({
				amount: this.lendAmount,
				apollo: this.apollo,
				loanId: this.loanId,
			}).then(() => {
				this.isAdding = false;
			}).catch(e => {
				this.isAdding = false;
				const msg = e[0].extensions.code === 'reached_anonymous_basket_limit'
					? e[0].message
					: 'There was a problem adding the loan to your basket';

				this.$showTipMsg(msg, 'error');
			});
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
					basketId: this.cookieStore.get('kvbskt'),
					loanId,
				});
			}
		},
	},
};
</script>
