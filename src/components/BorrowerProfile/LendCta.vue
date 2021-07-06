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
						<label for="LoanAmountDropdown" class="tw-sr-only">Lend amount</label>
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
							v-if="lendButtonVisibility"
							class="tw-inline-flex tw-flex-1"
							@click="addToBasket"
							v-kv-track-event="[
								'Lending',
								'Add to basket',
								ctaButtonText
							]"
						>
							{{ ctaButtonText }}
						</kv-ui-button>

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

						<!-- Lend again/lent previously button -->
						<kv-ui-button
							v-if="this.lentPreviously"
							class="tw-inline-flex tw-flex-1"
							@click="addToBasket"
							v-kv-track-event="[
								'Lending',
								'Add to basket',
								'Lend again'
							]"
						>
							Lend again
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

						<!-- Adding to basket button -->
						<kv-ui-button
							v-if="isAdding"
							class="tw-inline-flex tw-flex-1"
						>
							Adding to basket...
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

			<transition-group
				enter-active-class="tw-transition-opacity tw-duration-500 tw-delay-300"
				enter-class="tw-opacity-0"
				enter-to-class="tw-opacity-full"
			>
				<!-- leave-active-class="tw-transition-opacity tw-duration-300 tw-delay-300"
				leave-class="tw-opacity-full"
				leave-to-class="tw-opacity-0" -->
				<kv-grid
					v-show="lenderCountVisibilty || matchingTextVisibilty"
					key="grid"
					:class="[
						'tw-grid-cols-12',
						'tw-order-first',
						'tw-px-2.5',
						{
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
							'tw-col-span-12',
							'tw-mb-1 tw-p-1',
							'tw-rounded',
							'tw-bg-white',
							'tw-text-h4',
							'tw-flex tw-justify-center',
							'tw-mt-1',
							{
								'md:tw-mb-0': !isSticky,
								'md:tw-col-start-6 md:tw-col-span-7': !isSticky,
								'md:tw-col-start-5 md:tw-col-span-6': isSticky,
							},
							'lg:tw-mb-0',
							'lg:tw-col-span-12'
						]"
					>
						<!-- 'tw-col-span-12', -->
						<!-- <transition-group
							v-show="lenderCountVisibilty || matchingTextVisibilty"
							enter-active-class="tw-transition-opacity tw-duration-300 tw-delay-300"
							leave-active-class="tw-transition-opacity tw-duration-300"
							enter-class="tw-opacity-0 tw-absolute tw-top-0"
							enter-to-class="tw-opacity-full"
							leave-class="tw-opacity-full"
							leave-to-class="tw-opacity-0 tw-absolute tw-top-0"
						> -->
						<span
							key="numLendersStat"
							v-show="lenderCountVisibilty"
						>
							<kv-material-icon
								class="tw-h-2.5 tw-pointer-events-none"
								:icon="mdiLightningBolt"
							/>
							powered by {{ numLenders }} lenders
						</span>

						<span
							key="loanMatchingText"
							v-show="matchingTextVisibilty"
							class=""
						>
							{{ matchingText }}
						</span>
						<!-- </transition-group> -->
					</div>
				</kv-grid>
			</transition-group>
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
			lenderCountVisibilty: false,
<<<<<<< HEAD
			matchingTextVisibilty: false,
			matchingText: '',
=======
			basketItems: [],
>>>>>>> master
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
						matcherName
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
<<<<<<< HEAD
			this.hasFreeCredit = result?.data?.basket?.hasFreeCredits ?? false;
			this.matchingText = loan?.matchingText ?? '🤝 2X MATCHED LOAN';
=======
			this.hasFreeCredit = basket?.hasFreeCredits ?? false;
			this.basketItems = basket?.items?.values ?? [];
>>>>>>> master

			if (this.status === 'fundraising' && this.numLenders > 0) {
				this.lenderCountVisibilty = true;
			}

			if (this.matchingText !== '') {
				// this.matchingTextVisibilty = true;
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
		// animateSlotStatsContainerEnter() {
		// 	const slideInContainer = () => {

		// 	};
		// },
		animateSlotMachineStats() {
			const cycleSlotMachine = () => {
				if (this.lenderCountVisibilty) {
					console.log('inside animateSlotMachineStats if block');
					this.lenderCountVisibilty = false;
					this.matchingTextVisibilty = true;
				} else {
					console.log('inside animateSlotMachineStats OUTSIDE if block');
					this.matchingTextVisibilty = false;
					this.lenderCountVisibilty = true;
				}
			};
			setInterval(cycleSlotMachine, 5000);
		}
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
	},
	mounted() {
		this.createWrapperObserver();
		// this.animateSlotStatsContainerEnter();
		// this.animateSlotMachineStats();
	},
	beforeDestroy() {
		this.destroyWrapperObserver();
	},
};

</script>

<style lang="scss">
@import 'settings';

@keyframes slideInStatsContainer {
	from {
		top: -100%;
	}

	to {
		top: 100%;
	}
}
</style>
