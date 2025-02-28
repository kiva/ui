<template>
	<div
		class="tw-flex tw-flex-col"
		:style="{ minWidth: '230px', height: '100%', maxWidth: cardWidth}"
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
			@click="showLoanDetails"
		>
			<!-- If allSharesReserved, disable link by making it a span -->
			<router-link
				:is="allSharesReserved ? 'span' : 'router-link'"
				:to="customLoanDetails ? '' : `/lend/${loanId}`"
				v-kv-track-event="['Lending', 'click-Read more', 'Photo', loanId]"
			>
				<loan-tag v-if="showTags" :loan="loan" :amount-left="amountLeft" />
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
			:style="{minHeight: showActionButton ? 0 : '3rem'}"
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
		<p v-if="!isLoading" class="tw-mb-2.5 tw-flex-grow">
			{{ loanUse }}
			<kv-text-link
				v-kv-track-event="['Lending', 'click-Read more', 'Learn more', loanId]"
				@click="showLoanDetails"
			>
				Learn more
			</kv-text-link>
		</p>

		<!-- Matching text  -->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-mb-1" :style="{width: 75 + (Math.random() * 15) + '%', height: '1.3rem'}"
		/>

		<loan-matching-text
			v-if="!isLoading && loanMatchingText !== '' && !isMatchAtRisk"
			class="tw-mb-1.5"
			:matcher-name="loanMatchingText"
			:match-ratio="loanMatchRatio"
			:status="loanStatus"
			:funded-amount="loanFundedAmount"
			:reserved-amount="loanReservedAmount"
			:loan-amount="loanAmount"
		/>

		<!-- CTA Button -->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-rounded tw-self-start" :style="{width: '9rem', height: '3rem'}"
		/>

		<template v-if="!isLoading">
			<!-- If loan is in basket, always show checkout now button -->
			<kv-ui-button
				class="tw-mb-2 tw-text-secondary"
				variant="secondary"
				v-if="isInBasket"
				v-kv-track-event="['Lending', 'click-Read more', 'checkout-now-button-click', loanId, loanId]"
				:to="checkoutRoute"
				@click="$emit('custom-checkout-button-action', loanId)"
			>
				<slot>
					<div class="tw-inline-flex tw-items-center tw-gap-1">
						{{ customCheckoutButtonText }}
						<kv-material-icon
							class="tw-w-2.5 tw-h-2.5"
							:icon="mdiCheckCircleOutline"
						/>
					</div>
				</slot>
			</kv-ui-button>
			<!-- loan is not in basket -->
			<template v-if="!isInBasket">
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
				<template v-if="!allSharesReserved">
					<!-- View Loan button -->
					<kv-ui-button
						v-if="!showLendNowButton && !showActionButton"
						class="tw-mb-2 tw-self-start"
						:state="`${allSharesReserved ? 'disabled' : ''}`"
						:to="customLoanDetails ? '' : `/lend/${loanId}`"
						@click="showLoanDetails"
						v-kv-track-event="['Lending', 'click-Read-more', 'View loan', loanId]"
					>
						View loan
						<kv-material-icon
							class="tw-w-3 tw-h-3 tw-align-middle"
							:icon="mdiChevronRight"
						/>
					</kv-ui-button>

					<!-- Lend button -->
					<kv-ui-button
						key="lendButton"
						v-if="showLendNowButton && !isAdding"
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
						v-if="showLendNowButton && isAdding"
						class="tw-inline-flex tw-flex-1"
						data-testid="bp-lend-cta-adding-to-basket-button"
					>
						Adding to basket...
					</kv-ui-button>
					<!-- Action button -->
					<action-button
						v-if="showActionButton && !showLendNowButton"
						:loan-id="loanId"
						:loan="loan"
						:items-in-basket="basketItems"
						:is-lent-to="isLentTo"
						:is-funded="isFunded"
						:is-selected-by-another="isSelectedByAnother"
						:is-amount-lend-button="isLessThan25 && !enableFiveDollarsNotes"
						:amount-left="amountLeft"
						:show-now="!enableFiveDollarsNotes"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						@add-to-basket="addToBasket"
					/>
				</template>
			</template>
		</template>
	</div>
</template>

<script>
import numeral from 'numeral';
import { mdiChevronRight, mdiMapMarker, mdiCheckCircleOutline } from '@mdi/js';
import { gql } from 'graphql-tag';
import * as Sentry from '@sentry/vue';
import { isMatchAtRisk, readLoanFragment, watchLoanData } from '#src/util/loanUtils';
import { createIntersectionObserver } from '#src/util/observerUtils';
import percentRaisedMixin from '#src/plugins/loan/percent-raised-mixin';
import timeLeftMixin from '#src/plugins/loan/time-left-mixin';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import BorrowerName from '#src/components/BorrowerProfile/BorrowerName';
import KvLoadingParagraph from '#src/components/Kv/KvLoadingParagraph';
import LoanProgressGroup from '#src/components/LoanCards/LoanProgressGroup';
import LoanMatchingText from '#src/components/LoanCards/LoanMatchingText';
import SummaryTag from '#src/components/BorrowerProfile/SummaryTag';
import { setLendAmount, handleInvalidBasket, hasBasketExpired } from '#src/util/basketUtils';
import loanCardFieldsFragment from '#src/graphql/fragments/loanCardFields.graphql';
import ActionButton from '#src/components/LoanCards/Buttons/ActionButton';
import LoanTag from '#src/components/LoanCards/LoanTags/LoanTag';
import {
	KvLoadingPlaceholder, KvMaterialIcon, KvButton as KvUiButton, KvTextLink
} from '@kiva/kv-components';

const loanQuery = gql`
	${loanCardFieldsFragment}
	query kcBasicLoanCard($basketId: String, $loanId: Int!) {
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
			...loanCardFields

			# for loan-progress component
			unreservedAmount @client
			fundraisingPercent @client
			fundraisingTimeLeft @client
		}
	}
}`;

export default {
	name: 'KivaClassicBasicLoanCard',
	emits: ['show-loan-details', 'add-to-basket', 'custom-checkout-button-action'],
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
		},
		checkoutRoute: {
			type: String,
			default: '/basket'
		},
		customCheckoutButtonText: {
			type: String,
			default: 'Checkout now'
		},
		customLoanDetails: {
			type: Boolean,
			default: false
		},
		showActionButton: {
			type: Boolean,
			default: false
		},
		useFullWidth: {
			type: Boolean,
			default: false
		},
		showTags: {
			type: Boolean,
			default: false
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		useEmittedAddToBasket: {
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
		LoanProgressGroup,
		LoanMatchingText,
		KvMaterialIcon,
		SummaryTag,
		KvUiButton,
		KvTextLink,
		ActionButton,
		LoanTag,
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
			isAdding: false,
			watchedQuery: {},
		};
	},
	computed: {
		cardWidth() {
			return this.useFullWidth ? '100%' : '374px';
		},
		amountLeft() {
			const loanFundraisingInfo = this.loan?.loanFundraisingInfo ?? { fundedAmount: 0, reservedAmount: 0 };
			const { fundedAmount, reservedAmount } = loanFundraisingInfo;
			return numeral(this.loanAmount).subtract(fundedAmount).subtract(reservedAmount).value();
		},
		isFunded() {
			return this.loan?.status === 'funded';
		},
		isSelectedByAnother() {
			return this.amountLeft <= 0 && !this.isFunded;
		},
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
		lendAmount() {
			return this.isLessThan25 ? this.unreservedAmount : 25;
		},
		ctaButtonText() {
			return `Lend $${this.lendAmount} now`;
		},
		showLendNowButton() {
			return this.lendNowButton;
		},
		loanUse() {
			const use = this.loan?.fullLoanUse ?? '';
			return use.length > 75 ? `${use.slice(0, 75)}...` : use;
		},
		loanStatus() {
			return this.loan?.status ?? '';
		},
		loanAmount() {
			return this.loan?.loanAmount ?? '0';
		},
		loanBorrowerCount() {
			return this.loan?.borrowerCount ?? 0;
		},
		loanMatchingText() {
			return this.loan?.matchingText ?? '';
		},
		loanMatchRatio() {
			return this.loan?.matchRatio ?? '';
		},
		loanFundedAmount() {
			return this.loan?.loanFundraisingInfo?.fundedAmount ?? 0;
		},
		loanReservedAmount() {
			return this.loan?.loanFundraisingInfo?.reservedAmount ?? 0;
		}
	},
	methods: {
		showLoanDetails(e) {
			if (this.customLoanDetails) {
				e.preventDefault();
				this.$emit('show-loan-details');
			}
		},
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
				this.watchedQuery = watchLoanData({
					apollo: this.apollo,
					cookieStore: this.cookieStore,
					loanId: this.loanId,
					loanQuery,
					callback: result => this.processQueryResult(result),
				});
				this.queryObserver = this.watchedQuery.queryObserver;
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

			this.loan = result.data?.lend?.loan || null;
			if (this.loan) this.isLoading = false;
			this.basketItems = result.data?.shop?.basket?.items?.values || null;
		},
		addToBasket(payload) {
			if (this.useEmittedAddToBasket) {
				this.$emit('add-to-basket', payload);
				return true;
			}
			this.isAdding = true;
			setLendAmount({
				amount: this.lendAmount,
				apollo: this.apollo,
				loanId: this.loanId,
			}).then(() => {
				this.isAdding = false;
				this.$emit('add-to-basket', { loanId: this.loanId, success: true });
			}).catch(e => {
				this.isAdding = false;
				this.$emit('add-to-basket', { loanId: this.loanId, success: false });
				if (hasBasketExpired(e?.[0]?.extensions?.code)) {
					// eslint-disable-next-line max-len
					this.$showTipMsg('There was a problem adding the loan to your basket, refreshing the page to try again.', 'error');
					return handleInvalidBasket({
						cookieStore: this.cookieStore,
						loan: {
							id: this.loanId,
							price: this.lendAmount
						}
					});
				}
				const msg = e[0]?.extensions?.code === 'reached_anonymous_basket_limit'
					? e[0].message
					: 'There was a problem adding the loan to your basket';

				this.$showTipMsg(msg, 'error');
			});
		},
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
		this.watchedQuery.subscription?.unsubscribe();
	},
	created() {
		// Use cached loan data if it exists
		const cachedLoan = readLoanFragment({
			apollo: this.apollo,
			loanId: this.loanId,
			fragment: loanCardFieldsFragment,
		});
		if (cachedLoan) {
			this.loan = cachedLoan;
			this.isLoading = false;
		}
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
