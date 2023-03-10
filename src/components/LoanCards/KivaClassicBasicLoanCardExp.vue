<template>
	<div
		:id="`${loanId}-loan-card`"
		class="tw-flex tw-flex-col tw-p-1 tw-bg-white tw-rounded tw-w-full"
		style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);"
		:style="{ minWidth: '230px', maxWidth: cardWidth }"
	>
		<div class="tw-grow">
			<div>
				<!-- Borrower image -->
				<kv-loading-placeholder
					v-if="isLoading"
					class="tw-mb-1 tw-rounded" :style="{ width: '100%', height: imgPlaceholderHeight }"
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
								{ width: largestImageWidth, viewSize: 1024 },
								{ width: largestImageWidth, viewSize: 768 },
								{ width: 416, viewSize: 480 },
								{ width: 374, viewSize: 414 },
								{ width: 335, viewSize: 375 },
								{ width: 280 },
							]"
						/>

						<div v-if="countryName">
							<summary-tag
								id="locationPill"
								class="tw-absolute tw-bottom-1 tw-left-1 tw-text-primary"
								:city="city"
								:state="state"
								:country-name="countryName"
							>
								<kv-material-icon
									class="tw-h-2 tw-w-2"
									:icon="mdiMapMarker"
								/>
								{{ formattedLocation }}
							</summary-tag>
						</div>
					</router-link>
				</div>

				<!-- Loan tag -->
				<loan-tag-v2 v-if="showTags && !isLoading" :loan="loan" :amount-left="amountLeft" />

				<!-- Loan use  -->
				<div class="tw-mb-1.5 tw-mt-1">
					<kv-loading-paragraph
						v-if="isLoading"
						:style="{ width: '100%', height: '5.5rem' }"
					/>
					<div v-else>
						<router-link
							:is="allSharesReserved ? 'span' : 'router-link'"
							:to="customLoanDetails ? '' : `/lend/${loanId}`"
							v-kv-track-event="['Lending', 'click-Read more', 'Use', loanId]"
							class="loan-card-use tw-text-primary"
						>
							<loan-use
								:use="loanUse"
								:loan-amount="loanAmount"
								:status="loanStatus"
								:borrower-count="loanBorrowerCount"
								:name="borrowerName"
								:distribution-model="distributionModel"
								:show-more="true"
							/>
						</router-link>
					</div>
				</div>
			</div>

			<!-- Loan call outs -->
			<kv-loading-placeholder
				v-if="isLoading || typeof loanCallouts === 'undefined'"
				class="tw-mt-1.5 tw-mb-2"
				:style="{ width: '60%', height: '1.75rem', 'border-radius': '500rem' }"
			/>

			<loan-callouts v-else :callouts="loanCallouts" class="tw-mt-1.5" />
		</div>

		<div class="tw-flex tw-justify-between tw-mt-2">
			<!-- Fundraising -->
			<div v-if="!hasProgressData" class="tw-w-full tw-pt-1 tw-pr-1">
				<kv-loading-placeholder
					class="tw-mb-0.5"
					:style="{ width: '70%', height: '1.3rem' }"
				/>

				<kv-loading-placeholder
					class="tw-rounded"
					:style="{ width: '70%', height: '0.5rem' }"
				/>
			</div>

			<router-link
				v-if="unreservedAmount > 0"
				:is="allSharesReserved ? 'span' : 'router-link'"
				:to="customLoanDetails ? '' : `/lend/${loanId}`"
				v-kv-track-event="['Lending', 'click-Read more', 'Progress', loanId]"
				class="loan-card-progress tw-mt-1"
			>
				<loan-progress-group
					:money-left="unreservedAmount"
					:progress-percent="fundraisingPercent"
					:enable-loan-card-exp="true"
					class="tw-text-black"
					id="loanProgress"
				/>
			</router-link>

			<!-- CTA Button -->
			<kv-loading-placeholder
				v-if="isLoading"
				class="tw-rounded tw-self-start" :style="{ width: '9rem', height: '3rem' }"
			/>

			<lend-cta-exp
				v-else
				:loan="loan"
				:basket-items="basketItems"
				:is-loading="isLoading"
				:is-adding="isAdding"
				@add-to-basket="addToBasket"
				class="tw-mt-auto"
				:class="{ 'tw-w-full' : unreservedAmount <= 0 }"
			/>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import { mdiChevronRight, mdiMapMarker, mdiCheckCircleOutline } from '@mdi/js';
import { gql } from '@apollo/client';
import * as Sentry from '@sentry/vue';
import { readLoanFragment, watchLoanData, loanCallouts } from '@/util/loanUtils';
import { createIntersectionObserver } from '@/util/observerUtils';
import LoanUse from '@/components/LoanCards/LoanUse';
import percentRaisedMixin from '@/plugins/loan/percent-raised-mixin';
import timeLeftMixin from '@/plugins/loan/time-left-mixin';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import KvLoadingParagraph from '@/components/Kv/KvLoadingParagraph';
import LoanProgressGroup from '@/components/LoanCards/LoanProgressGroup';
import SummaryTag from '@/components/BorrowerProfile/SummaryTag';
import { setLendAmount, handleInvalidBasket } from '@/util/basketUtils';
import loanCardFieldsFragment from '@/graphql/fragments/loanCardFields.graphql';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import LoanCallouts from '@/components/LoanCards/LoanTags/LoanCallouts';
import LendCtaExp from '@/components/LoanCards/Buttons/LendCtaExp';
import LoanTagV2 from '@/components/LoanCards/LoanTags/LoanTagV2';
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
		customLoanDetails: {
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
		perRow: {
			type: Number,
			default: 3
		},
		categoryPageName: {
			type: String,
			default: '',
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
		KvMaterialIcon,
		SummaryTag,
		KvUiButton,
		ActionButton,
		LendCtaExp,
		LoanTagV2,
		LoanCallouts,
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
			loanCallouts: undefined,
		};
	},
	computed: {
		cardWidth() {
			return this.useFullWidth ? '100%' : '374px';
		},
		largestImageWidth() {
			// We currently only use grid or carousel rows with 2 or 3 loan cards
			// TODO: update cloudinary image settings to allow for exact new size if experiment wins
			// https://kiva.atlassian.net/browse/CORE-1045
			return this.perRow === 2 ? 548 : 336;
		},
		amountLeft() {
			const loanFundraisingInfo = this.loan?.loanFundraisingInfo ?? { fundedAmount: 0, reservedAmount: 0 };
			const { fundedAmount, reservedAmount } = loanFundraisingInfo;
			return numeral(this.loanAmount).subtract(fundedAmount).subtract(reservedAmount).value();
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
		hasProgressData() {
			// Local resolver values for the progress bar load client-side
			return typeof this.loan?.unreservedAmount !== 'undefined'
				&& typeof this.loan?.fundraisingPercent !== 'undefined';
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
		imgPlaceholderHeight() {
			const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;

			if (viewportWidth >= 1024) {
				if (this.perRow === 2) return '23rem'; return '14rem';
			}
			return '14rem';
		},
		lessThan25() {
			return this.amountLeft < 25 && this.amountLeft !== 0;
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

			// Set client-side to prevent call outs from changing on page load due to random selections
			this.loanCallouts = loanCallouts(this.loan, this.categoryPageName);

			if (this.loan) this.isLoading = false;

			this.basketItems = result.data?.shop?.basket?.items?.values || null;
		},
		addToBasket(lendAmount) {
			this.isAdding = true;
			setLendAmount({
				amount: lendAmount,
				apollo: this.apollo,
				loanId: this.loanId,
			}).then(() => {
				this.isAdding = false;
				this.$emit('add-to-basket', { loanId: this.loanId, success: true });
				this.$kvTrackEvent(
					'loan-card',
					'add-to-basket',
					null,
					this.loanId,
					this.lessThan25 ? this.amountLeft : 25
				);
			}).catch(e => {
				this.$emit('add-to-basket', { loanId: this.loanId, success: false });
				const msg = e?.[0]?.extensions?.code === 'reached_anonymous_basket_limit'
					? e?.[0]?.message
					: 'There was a problem adding the loan to your basket';
				this.$kvTrackEvent('Lending', 'Add-to-Basket', 'Failed to add loan. Please try again.');
				Sentry.captureException(e);
				// Handle errors from adding to basket
				if (e?.[0]?.extensions?.code === 'shop.invalidBasketId') {
					// eslint-disable-next-line max-len
					this.$showTipMsg('There was a problem adding the loan to your basket, refreshing the page to try again.', 'error');
					return handleInvalidBasket({
						cookieStore: this.cookieStore,
						loan: {
							id: this.loanId,
							price: lendAmount
						}
					});
				}
				this.$showTipMsg(msg, 'error');
				this.isAdding = false;
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

.loan-card-use,
.loan-card-use:hover,
.loan-card-use:focus {
	@apply tw-text-primary tw-no-underline;
}

.loan-card-progress >>> [role=progressbar] {
	margin-bottom: 0;
}

.loan-card-progress:hover,
.loan-card-progress:focus {
	@apply tw-no-underline;
}

#locationPill {
	background-color: #fff;
	padding: 2px 6px;
	text-transform: capitalize;
}

#loanProgress >>> h4 {
	text-transform: lowercase;
}
</style>
