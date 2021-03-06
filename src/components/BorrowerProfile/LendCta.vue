<template>
	<div ref="wrapper"
		:class="['lg:tw-mb-1.5', { 'md:tw-px-4': isSticky }]"
		:style="wrapperStyle"
	>
		<div
			:class="[
				'tw-w-full tw-z-sticky',
				'tw-flex tw-flex-col',
				'tw-fixed tw-left-0 tw-bottom-0',
				{
					'md:tw-static': !isSticky,
				},
				'lg:tw-static',
			]"
		>
			<kv-grid
				:class="[
					'tw-z-2',
					'tw-grid-cols-12',
					'tw-px-2.5',
					'tw-bg-white',
					'tw-border-t tw-border-gray-300',
					{
						'md:tw-rounded-b md:tw-border-none': !isSticky,
						'md:tw-px-3': !isSticky,
						'md:tw-px-4': isSticky,
					},
					'lg:tw-rounded-t',
					'lg:tw-px-4',
				]"
			>
				<div
					:class="[
						'tw-pt-1',
						'tw-col-span-12',
						{
							'md:tw-pt-0 md:tw-pb-2': !isSticky,
							'md:tw-col-start-2 md:tw-col-span-10': isSticky,
						},
						'lg:tw-col-span-12',
						'lg:tw-py-1',
					]"
				>
					<p class="tw-text-h3 tw-pt-3 lg:tw-mb-3 tw-hidden lg:tw-inline-block">
						{{ lgScreenheadline }}
					</p>
					<span class="tw-flex tw-pb-1 lg:tw-pb-3">
						<form v-if="useFormSubmit" @submit.prevent="addToBasket" class="tw-w-full tw-flex">
							<fieldset class="tw-w-full tw-flex" :disabled="isAdding">
								<label
									v-if="hideShowLendDropdown"
									for="LoanAmountDropdown"
									class="tw-sr-only"
								>
									Lend amount
								</label>
								<kv-ui-select
									v-if="hideShowLendDropdown"
									id="LoanAmountDropdown"
									class="tw-pr-2.5 tw--mb-2"
									v-model="selectedOption"
									v-kv-track-event="[
										'Lending',
										'click-Modify loan amount',
										'open dialog'
									]"
									@change="trackLendAmountSelection"
								>
									<option
										v-for="priceOption in prices"
										:key="priceOption"
										:value="priceOption"
									>
										${{ priceOption }}
									</option>
								</kv-ui-select>

								<!-- Lend button -->
								<kv-ui-button
									key="lendButton"
									v-if="lendButtonVisibility"
									class="tw-inline-flex tw-flex-1"
									type="submit"
									v-kv-track-event="[
										'Lending',
										'Add to basket',
										ctaButtonText
									]"
								>
									{{ ctaButtonText }}
								</kv-ui-button>

								<!-- Lend again/lent previously button -->
								<kv-ui-button
									key="lendAgainButton"
									v-if="this.state === 'lent-to'"
									class="tw-inline-flex tw-flex-1"
									type="submit"
									v-kv-track-event="[
										'Lending',
										'Add to basket',
										'Lend again'
									]"
								>
									Lend again
								</kv-ui-button>

								<!-- Adding to basket button -->
								<kv-ui-button
									v-if="isAdding"
									class="tw-inline-flex tw-flex-1"
								>
									Adding to basket...
								</kv-ui-button>
							</fieldset>
						</form>

						<!-- Continue to checkout button -->
						<kv-ui-button
							v-if="this.state === 'basketed'"
							class="tw-inline-flex tw-flex-1"
							to="/basket"
							v-kv-track-event="[
								'Lending',
								'click-Continue-to-checkout',
								'Continue to checkout'
							]"
						>
							Continue to checkout
						</kv-ui-button>

						<!-- Funded, refunded, expired/ allSharesReserved button -->
						<kv-ui-button
							v-if="showNonActionableLoanButton"
							class="tw-inline-flex tw-flex-1"
							to="/lend-by-category"
							v-kv-track-event="[
								'Lending',
								'Non actionable loan',
								ctaButtonText,
								this.status
							]"
						>
							{{ ctaButtonText }}
						</kv-ui-button>
					</span>
					<p
						v-if="freeCreditWarning"
						class="tw-text-h4 tw-text-gray-500 tw-inline-block tw-text-center tw-w-full"
					>
						Not eligilble for lending credit
					</p>
					<p
						v-if="allSharesReserved"
						class="tw-text-h4 tw-text-gray-500 tw-inline-block tw-text-center tw-w-full"
					>
						All shares reserved
					</p>
				</div>
			</kv-grid>

			<transition
				enter-active-class="tw-transition-transform tw-duration-700 tw-delay-300"
				:enter-class="transitionEnterClasses"
				enter-to-class="tw-transform tw-translate-y-0 md:tw-translate-y-0 lg:tw-translate-y-0"
			>
				<kv-grid
					v-show="lenderCountVisibility || matchingTextVisibility"
					key="grid"
					:class="[
						'tw-grid-cols-12',
						'tw-order-first',
						'tw-px-2.5',
						'tw-absolute',
						'tw-bottom-8',
						'tw-w-full',
						{
							'md:tw-relative': !isSticky,
							'md:tw-bottom-0': !isSticky,
							'md:tw-order-none': !isSticky,
							'md:tw-px-3': !isSticky,
							'md:tw-px-4': isSticky,
						},
						'lg:tw-px-0',
					]"
				>
					<div
						key="wrapper"
						:class="[
							'tw-z-1',
							'tw-h-5',
							'tw-overflow-hidden',
							'tw-col-span-12',
							'tw-mb-1 tw-p-1',
							'tw-rounded',
							'tw-bg-white',
							'tw-text-h4',
							'tw-flex tw-justify-center',
							'tw-mt-1',
							{
								'tw-relative': !isSticky,
								'md:tw-mb-0': !isSticky,
								'md:tw-col-start-6 md:tw-col-span-7': !isSticky,
								'md:tw-col-start-5 md:tw-col-span-6': isSticky,
							},
							'lg:tw-mb-0',
							'lg:tw-col-span-12'
						]"
					>
						<transition
							mode="out-in"
							key="transition"
							class="tw-flex tw-flex-col"
							enter-active-class="tw-transition-all tw-duration-1000"
							enter-class="tw-transform tw--translate-y-2 tw-opacity-0"
							enter-to-class="tw-transform tw-translate-y-0 tw-opacity-full"
							leave-active-class="tw-transition-all tw-duration-1000"
							leave-class="tw-transform tw-translate-y-0 tw-opacity-full"
							leave-to-class="tw-transform tw-translate-y-2 tw-opacity-0"
						>
							<span
								class="tw-inline-block tw-align-middle"
								key="numLendersStat"
								v-if="statScrollAnimation"
							>
								<kv-material-icon
									class="tw-h-2.5 tw-pointer-events-none tw-inline-block tw-align-middle"
									:icon="mdiLightningBolt"
								/>
								powered by {{ numLenders }} lenders
							</span>

							<span
								class="tw-inline-block tw-align-middle"
								key="loanMatchingText"
								v-if="!statScrollAnimation"
							>
								<span
									class="tw-text-h3 tw-inline-block tw-align-middle tw-px-1"
								>
									🎉
								</span>
								2X MATCHED LOAN
							</span>
						</transition>
					</div>
				</kv-grid>
			</transition>
		</div>
	</div>
</template>

<script>
import { mdiLightningBolt } from '@mdi/js';
import gql from 'graphql-tag';
import { setLendAmount } from '@/util/basketUtils';
import { buildPriceArray } from '@/util/loanUtils';
import { createIntersectionObserver } from '@/util/observerUtils';
import KvUiSelect from '~/@kiva/kv-components/vue/KvSelect';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvUiButton from '~/@kiva/kv-components/vue/KvButton';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	inject: ['apollo', 'cookieStore'],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	components: {
		KvGrid,
		KvMaterialIcon,
		KvUiButton,
		KvUiSelect,
	},
	data() {
		return {
			mdiLightningBolt,
			defaultSelectorAmount: 25,
			selectedOption: '25',
			loanAmount: '',
			isExpiringSoon: false,
			fundedAmount: '',
			reservedAmount: '',
			unreservedAmount: '',
			lentPreviously: false,
			promoEligible: false,
			minNoteSize: '',
			status: '',
			numLenders: 0,
			lenderCountVisibility: false,
			matchingTextVisibility: false,
			statScrollAnimation: false,
			matchingText: '',
			basketItems: [],
			isAdding: false,
			isLoading: true,
			hasFreeCredit: false,
			isSticky: false,
			wrapperHeight: 0,
			wrapperObserver: null,
		};
	},
	apollo: {
		query: gql`
			query lendCta($loanId: Int!, $basketId: String) {
				lend {
					loan(id: $loanId) {
						id
						status
						minNoteSize
						loanAmount
						matchingText
						unreservedAmount @client
						loanFundraisingInfo {
							fundedAmount
							reservedAmount
							isExpiringSoon
						}
						userProperties {
							lentTo
							promoEligible(basketId: $basketId)
						}
						lenders{
							totalCount
						}
					}
				}
				shop (basketId: $basketId) {
					id
					basket {
						id
						hasFreeCredits
						items {
							values {
								id
							}
						}
					}
				}
			}
		`,
		preFetch: false,
		variables() {
			return {
				loanId: this.loanId,
			};
		},
		result(result) {
			this.isLoading = false;
			const loan = result?.data?.lend?.loan;
			const basket = result?.data?.shop?.basket;

			this.loanAmount = loan?.loanAmount ?? '0';
			this.status = loan?.status ?? '';
			this.minNoteSize = loan?.minNoteSize ?? '';
			this.fundedAmount = loan?.loanFundraisingInfo?.fundedAmount ?? '';
			this.reservedAmount = loan?.loanFundraisingInfo?.reservedAmount ?? '';
			this.unreservedAmount = loan?.unreservedAmount ?? '';
			this.isExpiringSoon = loan?.loanFundraisingInfo?.isExpiringSoon ?? false;
			this.lentPreviously = loan?.userProperties?.lentTo ?? false;
			this.promoEligible = loan?.userProperties?.promoEligible ?? false;
			this.numLenders = loan?.lenders?.totalCount ?? 0;
			this.hasFreeCredit = basket?.hasFreeCredits ?? false;
			this.basketItems = basket?.items?.values ?? [];
			this.matchingText = loan?.matchingText ?? '';

			if (this.status === 'fundraising' && this.numLenders > 0) {
				this.lenderCountVisibility = true;
			}

			if (this.lenderCountVisibility && this.matching !== '') {
				this.statScrollAnimation = true;
			}
		},
	},
	methods: {
		addToBasket() {
			this.isAdding = true;
			setLendAmount({
				amount: this.selectedOption,
				apollo: this.apollo,
				loanId: this.loanId,
			}).then(() => {
				this.isAdding = false;
			}).catch(() => {
				this.isAdding = false;
				this.$showTipMsg('There was a problem adding the loan to your basket', 'error');
			});
		},
		createWrapperObserver() {
			// Watch for the wrapper element moving in and out of the viewport
			this.wrapperObserver = createIntersectionObserver({
				targets: [this.$refs?.wrapper],
				callback: entries => {
					entries.forEach(entry => {
						if (entry.target === this.$refs?.wrapper) {
							if (entry.intersectionRatio > 0) {
								// Wrapper is in the viewport, so lend cta should NOT be stuck to the bottom
								this.isSticky = false;
							} else {
								// Wrapper is NOT the viewport, so lend cta should be stuck to the bottom
								this.wrapperHeight = entry.boundingClientRect.height;
								this.isSticky = true;
							}
						}
					});
				},
			});
		},
		destroyWrapperObserver() {
			if (this.wrapperObserver) {
				this.wrapperObserver.disconnect();
			}
		},
		trackLendAmountSelection(selectedDollarAmount) {
			this.$kvTrackEvent(
				'Lending',
				'Modify lend amount',
				selectedDollarAmount
			);
		},
		cycleStatsSlot() {
			if (this.matchingText.length) {
				const cycleSlotMachine = () => {
					if (this.statScrollAnimation) {
						this.statScrollAnimation = false;
					} else {
						this.statScrollAnimation = true;
					}
				};
				setInterval(cycleSlotMachine, 5000);
			}
		}
	},
	watch: {
		matchingText(newValue, previousValue) {
			if (newValue !== previousValue && newValue !== '') {
				this.cycleStatsSlot();
			}
		},
	},
	computed: {
		isInBasket() {
			// eslint-disable-next-line no-underscore-dangle
			return this.basketItems.some(item => item.__typename === 'LoanReservation' && item.id === this.loanId);
		},
		prices() {
			const minAmount = parseFloat(this.minNoteSize);
			// limit at 20 price options
			return buildPriceArray(parseFloat(this.unreservedAmount), minAmount).slice(0, 20);
		},
		lgScreenheadline() {
			switch (this.state) {
				case 'loading':
					return 'Loading...';
				case 'funded':
					return 'Help more borrowers like this';
				case 'refunded':
				case 'expired':
				case 'fully-reserved':
					return 'Help fund other borrowers';
				default:
					return 'Help fund this loan';
			}
		},
		ctaButtonText() {
			switch (this.state) {
				case 'loading':
					return 'Loading...';
				case 'funded':
					return 'Find another loan like this';
				case 'refunded':
				case 'expired':
				case 'fully-reserved':
					return 'Find another loan';
				default:
					return 'Lend now';
			}
		},
		useFormSubmit() {
			if (this.hideShowLendDropdown
				|| this.lendButtonVisibility
				|| this.lendAgainButton
				|| this.state === 'lent-to'
				|| this.isAdding) {
				return true;
			}
			return false;
		},
		state() {
			if (this.isLoading) {
				return 'loading';
			}
			if (this.isAdding) {
				return 'adding';
			}
			if (this.isInBasket) {
				return 'basketed';
			}
			if (this.status === 'funded' || this.status === 'refunded' || this.status === 'expired') {
				return this.status;
			}
			if (this.allSharesReserved) {
				return 'fully-reserved';
			}
			if (this.lentPreviously) {
				return 'lent-to';
			}
			return 'lend';
		},
		showAdding() {
			return this.state === 'adding';
		},
		lendButtonVisibility() {
			return this.state === 'lend' || this.state === 'loading';
		},
		showNonActionableLoanButton() {
			return this.state === 'funded'
				|| this.state === 'refunded'
				|| this.state === 'expired'
				|| this.state === 'fully-reserved';
		},
		hideShowLendDropdown() {
			return this.state === 'lend' || this.state === 'lent-to';
		},
		freeCreditWarning() {
			return this.hasFreeCredit === true && this.promoEligible === false;
		},
		allSharesReserved() {
			if (parseFloat(this.unreservedAmount) === 0) {
				return true;
			}
			return false;
		},
		wrapperStyle() {
			return {
				paddingBottom: this.isSticky ? `${this.wrapperHeight}px` : '0',
			};
		},
		transitionEnterClasses() {
			if (this.isSticky) {
				return 'tw-transform tw-translate-y-7 md:tw-translate-y-7 lg:tw--translate-y-7';
			}
			return 'tw-transform tw-translate-y-7 md:tw--translate-y-7 lg:tw--translate-y-7';
		},
	},
	mounted() {
		this.createWrapperObserver();
		this.cycleStatsSlot();
	},
	beforeDestroy() {
		this.destroyWrapperObserver();
	},
};

</script>
