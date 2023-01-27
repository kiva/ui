<template>
	<div
		:id="`${loanId}-loan-card`"
		class="tw-flex tw-flex-col"
		:class="{ 'loan-card-in-grid tw-px-2 tw-mb-4': inGrid, 'loan-card-active-hover': !allSharesReserved }"
		:style="{ ...(!inGrid && { minWidth: '230px', maxWidth: cardWidth }) }"
	>
		<!-- Borrower image -->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-mb-1 tw-rounded" :style="{ width: '100%', height: '15.75rem' }"
		/>
		<div
			v-else
			class="tw-relative"
			@click="showLoanDetails"
		>
			<router-link
				:is="allSharesReserved ? 'span' : 'router-link'"
				:to="customLoanDetails ? '' : `/lend/${loanId}`"
				v-kv-track-event="['Lending', 'click-Read more', 'Photo', loanId]"
				class="tw-flex"
			>
				<loan-tag v-if="showTags" :loan="loan" :amount-left="amountLeft" />

				<borrower-image
					class="
					tw-relative
					tw-w-full
					tw-bg-black
					tw-rounded
				"
					:alt="`Photo of ${borrowerName}`"
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
						class="tw-absolute tw-bottom-1 tw-left-1 tw-text-primary"
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

		<!-- Fundraising -->
		<div v-if="isLoading">
			<kv-loading-placeholder
				class="tw-mb-0.5"
				:style="{ width: 40 + (Math.random() * 15) + '%', height: '1.3rem' }"
			/>

			<kv-loading-placeholder
				class="tw-mb-1.5 tw-rounded"
				:style="{ width: '100%', height: '0.5rem' }"
			/>
		</div>

		<router-link
			v-else
			:is="allSharesReserved ? 'span' : 'router-link'"
			:to="customLoanDetails ? '' : `/lend/${loanId}`"
			v-kv-track-event="['Lending', 'click-Read more', 'Progress', loanId]"
			class="loan-card-progress tw-my-1.5"
		>
			<loan-progress-group
				:money-left="unreservedAmount"
				:progress-percent="fundraisingPercent"
				:time-left="timeLeftMessage"
			/>
		</router-link>

		<!-- Loan use  -->
		<div class="tw-grow tw-mb-1.5">
			<kv-loading-paragraph
				v-if="isLoading"
				:style="{ width: '100%', height: '5.5rem' }"
			/>

			<router-link
				v-else
				:is="allSharesReserved ? 'span' : 'router-link'"
				:to="customLoanDetails ? '' : `/lend/${loanId}`"
				v-kv-track-event="['Lending', 'click-Read more', 'Use', loanId]"
				class="loan-card-use tw-text-primary"
			>
				<loan-use
					:loan-use-max-length="150"
					:loan-id="`${allSharesReserved ? '' : loanId}`"
					:use="loanUse"
					:name="borrowerName"
					:status="loanStatus"
					:loan-amount="loanAmount"
					:borrower-count="loanBorrowerCount"
					:custom-loan-details="customLoanDetails"
					:show-learn-more="false"
					@show-loan-details="showLoanDetails"
				/>
			</router-link>
		</div>

		<!-- Matching text  -->
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
			class="tw-rounded tw-self-start" :style="{ width: '9rem', height: '3rem' }"
		/>

		<template v-else>
			<!-- If loan is in basket, always show checkout now button -->
			<kv-ui-button
				class="tw-mb-2 tw-text-secondary"
				variant="secondary"
				v-if="isInBasket"
				v-kv-track-event="['Lending', 'click-Read more', 'checkout-now-button-click', loanId, loanId]"
				:to="customCheckoutRoute ? customCheckoutRoute : '/basket'"
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
			<!-- loan is not in basket -->
			<template v-else>
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
				<template v-else>
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
						v-if="showLendNowButton && !isAdding"
						key="lendButton"
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
						:is-amount-lend-button="isLessThan25"
						:amount-left="amountLeft"
						:show-now="true"
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
import { gql } from '@apollo/client';
import * as Sentry from '@sentry/vue';
import { isMatchAtRisk, readLoanFragment, watchLoanData } from '@/util/loanUtils';
import { createIntersectionObserver } from '@/util/observerUtils';
import LoanUse from '@/components/BorrowerProfile/LoanUse';
import percentRaisedMixin from '@/plugins/loan/percent-raised-mixin';
import timeLeftMixin from '@/plugins/loan/time-left-mixin';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import KvLoadingParagraph from '@/components/Kv/KvLoadingParagraph';
import LoanProgressGroup from '@/components/LoanCards/LoanProgressGroup';
import LoanMatchingText from '@/components/LoanCards/LoanMatchingText';
import SummaryTag from '@/components/BorrowerProfile/SummaryTag';
import { setLendAmount } from '@/util/basketUtils';
import loanCardFieldsFragment from '@/graphql/fragments/loanCardFields.graphql';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import LoanTag from '@/components/LoanCards/LoanTags/LoanTag';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvUiButton from '~/@kiva/kv-components/vue/KvButton';

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
	name: 'KivaClassicBasicLoanCardExp',
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
		customCheckoutRoute: {
			type: String,
			default: ''
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
		inGrid: {
			type: Boolean,
			default: false
		},
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [percentRaisedMixin, timeLeftMixin],
	components: {
		BorrowerImage,
		KvLoadingPlaceholder,
		KvLoadingParagraph,
		LoanUse,
		LoanProgressGroup,
		LoanMatchingText,
		KvMaterialIcon,
		SummaryTag,
		KvUiButton,
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
			isAdding: false
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
			return this.loan?.use ?? '';
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
		},
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

			this.loan = result.data?.lend?.loan || null;
			if (this.loan) this.isLoading = false;
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
				this.$emit('add-to-basket', { loanId: this.loanId, success: true });
			}).catch(e => {
				this.isAdding = false;
				this.$emit('add-to-basket', { loanId: this.loanId, success: false });
				const msg = e[0].extensions.code === 'reached_anonymous_basket_limit'
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
	beforeDestroy() {
		this.destroyViewportObserver();
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

<style lang="postcss" scoped>
.loan-card-active-hover:hover .loan-card-use {
	@apply tw-underline;
}

.loan-card-progress:hover {
	@apply tw-no-underline;
}

.loan-card-progress:active {
	@apply tw-no-underline;
}

.loan-card-use:hover {
	@apply tw-text-primary;
}

/* TODO: refactor to tw classes/breakpoints when foundation classes removed from loan grid */
@media (min-width: 30.0625em) {
	.loan-card-in-grid {
		max-width: 100%;
		min-width: 100%;
	}
}

@media (min-width: 42.5625em) {
	.loan-card-in-grid {
		max-width: 50%;
		min-width: auto;
	}
}

@media (min-width: 61.8125em) {
	.loan-card-in-grid {
		max-width: calc(100% / 3);
	}
}
</style>
