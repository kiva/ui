<template>
	<div
		ref="wrapper"
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
					'tw-bg-primary',
					'tw-border-t tw-border-tertiary',
					{
						'md:tw-rounded-b': !isSticky,
						'md:tw-border-none': !isSticky,
						'md:tw-px-3': !isSticky,
						'md:tw-px-4': isSticky,
					},
					'lg:tw-rounded-t',
					'lg:tw-px-4',
					'lg:tw-gap-1'
				]"
			>
				<div
					:class="[
						'tw-pt-1',
						'tw-col-span-12',
						{
							'md:tw-pt-0': !isSticky,
							'md:tw-col-start-2 md:tw-col-span-10': isSticky,
						},
						'lg:tw-col-span-12',
						{
							'lg:tw-pt-1 lg:tw-pb-1': !socialExpEnabled,
							'lg:tw-pt-1 lg:tw-pb-0': socialExpEnabled,
						},
					]"
				>
					<p class="tw-text-h3 tw-pt-3 lg:tw-mb-3 tw-hidden lg:tw-inline-block">
						{{ lgScreenheadline }}
					</p>
					<span class="tw-flex tw-pb-1 lg:tw-pb-2.5">
						<!-- eslint-disable-next-line max-len -->
						<form v-if="useFormSubmit" @submit.prevent="addToBasket" class="tw-w-full tw-flex">
							<fieldset
								class="tw-w-full tw-flex" :disabled="isAdding"
								data-testid="bp-lend-cta-select-and-button"
							>
								<label
									v-if="hideShowLendDropdown && !isLessThan25"
									for="LoanAmountDropdown"
									class="tw-sr-only"
								>
									Lend amount
								</label>
								<kv-ui-select
									v-if="hideShowLendDropdown && !isLessThan25"
									id="LoanAmountDropdown"
									class="tw-pr-2.5 tw--mb-2"
									data-testid="bp-lend-cta-amount-dropdown"
									v-model="selectedOption"
									v-kv-track-event="[
										'Lending',
										'click-Modify loan amount',
										'open dialog'
									]"
									@update:modelValue="trackLendAmountSelection"
								>
									<option
										v-for="priceOption in prices"
										:key="priceOption"
										:value="priceOption"
									>
										${{ priceOption }}
									</option>
								</kv-ui-select>

								<!-- Sparkles wrapper -->
								<div
									class="tw-relative tw-inline-flex tw-flex-1"
									:class="{'tw-w-full':isLendAmountButton}"
								>
									<!-- Lend button -->
									<kv-ui-button
										key="lendButton"
										v-if="lendButtonVisibility && !isLessThan25"
										class="tw-inline-flex tw-flex-1"
										data-testid="bp-lend-cta-lend-button"
										type="submit"
									>
										{{ ctaButtonText }}
									</kv-ui-button>

									<!-- Lend again/lent previously button -->
									<kv-ui-button
										key="lendAgainButton"
										v-if="this.state === 'lent-to' && !isLessThan25"
										class="tw-inline-flex tw-flex-1"
										data-testid="bp-lend-cta-lend-again-button"
										type="submit"
										v-kv-track-event="[
											'Lending',
											'Add to basket',
											'Lend again'
										]"
									>
										Lend again
									</kv-ui-button>

									<!-- Stranded loans -->
									<lend-amount-button
										class="tw-w-full"
										:loan-id="loanId"
										:show-now="true"
										:amount-left="unreservedAmount"
										@add-to-basket="addToBasket"
										:complete-loan="completeLoan"
										v-if="isLendAmountButton"
									/>

									<!-- Adding to basket button -->
									<kv-ui-button
										v-if="isAdding"
										class="tw-inline-flex tw-flex-1"
										data-testid="bp-lend-cta-adding-to-basket-button"
									>
										Adding to basket...
									</kv-ui-button>

									<!-- Sparkles section -->
									<img
										v-show="isCompleteLoanActive"
										class="tw-absolute tw--bottom-1 tw--left-1 tw-animate-pulse"
										src="@/assets/images/sparkle.svg"
									>
									<img
										v-show="isCompleteLoanActive"
										class="tw-absolute tw--top-2 tw-right-1.5 tw-animate-pulse tw-scale-50"
										style="animation-delay: 300ms;"
										src="@/assets/images/sparkle.svg"
									>
									<img
										v-show="isCompleteLoanActive"
										class="tw-absolute tw--top-1 tw--right-1 tw-animate-pulse"
										src="@/assets/images/sparkle.svg"
									>
									<img
										v-show="isCompleteLoanActive"
										class="tw-absolute tw-top-2 tw--right-1.5 tw-animate-pulse tw-scale-75"
										style="animation-delay: 800ms;"
										src="@/assets/images/sparkle.svg"
									>
								</div>
							</fieldset>
						</form>

						<!-- Continue to checkout button -->
						<kv-ui-button
							v-if="this.state === 'basketed'"
							class="tw-inline-flex tw-flex-1"
							data-testid="bp-lend-cta-checkout-button"
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
							data-testid="bp-lend-cta-non-actionable-loan-button"
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
					<slot v-if="!isSticky" name="sharebutton"></slot>
					<p
						v-if="freeCreditWarning"
						class="tw-text-h4 tw-text-secondary tw-inline-block tw-text-center tw-w-full tw-mb-3"
						data-testid="bp-lend-cta-not-eligible-for-credit"
					>
						Not eligible for lending credit
					</p>
					<p
						v-if="allSharesReserved"
						class="tw-text-h4 tw-text-secondary tw-inline-block tw-text-center tw-w-full tw-mb-3"
						data-testid="bp-lend-cta-all-shares-reserved"
					>
						All shares reserved
					</p>
					<hr
						class="tw-hidden md:tw-block tw-border-tertiary tw-w-full tw-my-2"
					>
					<div
						class="tw-flex lg:tw-justify-center tw-w-full"
						:class="isLoggedIn ? 'tw-justify-between' : 'tw-justify-end'"
					>
						<loan-bookmark
							v-if="isLoggedIn"
							data-testid="bp-lend-cta-loan-bookmark"
							:loan-id="loanId"
							class="tw-hidden md:tw-inline-block lg:tw-hidden"
						/>
						<jump-links
							:class="[
								'tw-hidden md:tw-block lg:tw-mb-1.5',
								{
									'md:tw-mb-3': isSticky || !socialExpEnabled,
								}
							]"
							data-testid="bp-lend-cta-jump-links"
						/>
					</div>
				</div>
				<div
					v-if="socialExpEnabled"
					:class="[
						'tw-hidden',
						{
							'md:tw-block': !isSticky,
						},
						'tw-col-span-12',
						'md:tw-col-start-7 md:tw-col-span-6',
						'lg:tw-col-span-12',
					]"
				>
					<hr
						v-if="socialExpEnabled && lenders.length"
						class="tw-hidden lg:tw-block tw-border-tertiary tw-w-full tw-mb-3"
					>
					<lenders-list
						v-if="socialExpEnabled && lenders.length"
						:num-lenders="numLenders"
						:lenders="lenders"
						key="lenderList"
						@togglelightbox="toggleLightbox"
					/>
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
							'tw-h-5',
							'tw-overflow-hidden',
							'tw-col-span-12',
							'tw-mb-1 tw-p-1',
							'tw-rounded',
							'tw-bg-primary',
							'tw-text-h4',
							'tw-flex tw-justify-center',
							'tw-mt-1',
							{
								'tw-relative': !isSticky,
								'md:tw-mb-0': !isSticky,
								'md:tw-col-start-6 md:tw-col-span-7': !isSticky,
								'md:tw-col-start-5 md:tw-col-span-6': isSticky,
								'md:tw-hidden': isSticky,
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
								data-testid="bp-lend-cta-powered-by-text"
								key="numLendersStat"
								v-if="statScrollAnimation"
							>
								<kv-material-icon
									class="tw-w-2.5 tw-h-2.5 tw-pointer-events-none tw-inline-block tw-align-middle"
									:icon="mdiLightningBolt"
								/>
								powered by {{ numLenders }} lenders
							</span>

							<span
								class="tw-inline-block tw-align-middle"
								data-testid="bp-lend-cta-matched-text"
								key="loanMatchingText"
								v-if="!statScrollAnimation && !isMatchAtRisk"
							>
								<span
									class="tw-text-h3 tw-inline-block tw-align-middle tw-px-1"
								>
									🎉
								</span>
								{{ matchRatio + 1 }}X
								<span v-if="requireDepositsMatchedLoans"> MATCHED NEW DEPOSITS</span>
								<span v-else> MATCHED LOAN</span>
							</span>
						</transition>
					</div>
				</kv-grid>
			</transition>

			<eco-challenge-lightbox
				:visible="showGameLightbox"
				:progresses="checkoutMilestoneProgresses"
				@close-lightbox="showGameLightbox = false;"
			/>
		</div>
	</div>
</template>

<script>
import { mdiLightningBolt } from '@mdi/js';
import { gql } from '@apollo/client';
import { setLendAmount } from '@/util/basketUtils';
import { buildPriceArray, isMatchAtRisk } from '@/util/loanUtils';
import { createIntersectionObserver } from '@/util/observerUtils';
import {
	getExperimentSettingCached,
	trackExperimentVersion
} from '@/util/experimentUtils';
import { achievementsQuery, hasMadeAchievementsProgression } from '@/util/ecoChallengeUtils';

import JumpLinks from '@/components/BorrowerProfile/JumpLinks';
import LoanBookmark from '@/components/BorrowerProfile/LoanBookmark';
import EcoChallengeLightbox from '@/components/Lightboxes/EcoChallengeLightbox';
import LendAmountButton from '@/components/LoanCards/Buttons/LendAmountButton';
import LendersList from '@/components/BorrowerProfile/LendersList';

import KvUiSelect from '~/@kiva/kv-components/vue/KvSelect';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvUiButton from '~/@kiva/kv-components/vue/KvButton';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

const ecoChallengeExpKey = 'eco_challenge';

export default {
	name: 'LendCta',
	inject: ['apollo', 'cookieStore'],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
		completeLoan: {
			type: Boolean,
			default: false,
		},
		lenders: {
			type: Array,
			default: () => []
		},
		socialExpEnabled: {
			type: Boolean,
			default: false
		},
		requireDepositsMatchedLoans: {
			type: Boolean,
			default: false,
		}
	},
	components: {
		LendersList,
		LendAmountButton,
		KvGrid,
		EcoChallengeLightbox,
		KvMaterialIcon,
		KvUiButton,
		KvUiSelect,
		JumpLinks,
		LoanBookmark,
	},
	data() {
		return {
			isLoggedIn: false,
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
			matchRatio: 0,
			basketItems: [],
			isAdding: false,
			isLoading: true,
			hasFreeCredit: false,
			isSticky: false,
			wrapperHeight: 0,
			wrapperObserver: null,
			name: '',
			completeLoanView: true,
			showGameLightbox: false,
			checkoutMilestoneProgresses: [],
		};
	},
	apollo: {
		query: gql`
			query lendCta($loanId: Int!, $basketId: String) {
				lend {
					loan(id: $loanId) {
						id
						status
						name
						minNoteSize
						loanAmount
						matchingText
						matchRatio
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
				my {
					userAccount {
						id
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

			this.isLoggedIn = result?.data?.my?.userAccount?.id !== undefined || false;
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
			this.matchRatio = loan?.matchRatio ?? 0;
			this.name = loan?.name ?? '';
			this.matchingTextVisibility = this.status === 'fundraising' && this.matchingText && !this.isMatchAtRisk;

			if (this.status === 'fundraising' && this.numLenders > 0) {
				this.lenderCountVisibility = !this.socialExpEnabled;
				this.statScrollAnimation = !this.socialExpEnabled;
			}
		},
	},
	methods: {
		async addToBasket() {
			this.isAdding = true;
			setLendAmount({
				amount: this.isLessThan25 ? this.unreservedAmount : this.selectedOption,
				apollo: this.apollo,
				loanId: this.loanId,
			}).then(() => {
				this.isAdding = false;
				this.$kvTrackEvent('Lending', 'Add to basket', this.ctaButtonText);
				if (this.isCompleteLoanActive) {
					// eslint-disable-next-line max-len
					this.$kvTrackEvent('Borrower profile', 'Complete loan', 'click-amount-left-cta', this.loanId, this.selectedOption);
				}
			}).catch(e => {
				this.isAdding = false;
				const msg = e[0].extensions.code === 'reached_anonymous_basket_limit'
					? e[0].message
					: 'There was a problem adding the loan to your basket';

				this.$showTipMsg(msg, 'error');
			});

			// Game code
			const ecoChallengeExpData = getExperimentSettingCached(this.apollo, ecoChallengeExpKey);
			if (ecoChallengeExpData?.enabled) {
				const { version } = trackExperimentVersion(
					this.apollo,
					this.$kvTrackEvent,
					'Lending',
					ecoChallengeExpKey,
					'EXP-ACK-392-Sep2022'
				);
				if (version === 'b') {
					// check achievements service for progress
					const myAchievements = await achievementsQuery(this.apollo, [this.loanId]);
					// eslint-disable-next-line max-len
					this.checkoutMilestoneProgresses = myAchievements?.data?.achievementMilestonesForCheckout?.checkoutMilestoneProgresses;
					this.showGameLightbox = hasMadeAchievementsProgression(
						this.checkoutMilestoneProgresses,
						'climate-challenge'
					);
				}
			}
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
					if (!this.isMatchAtRisk) {
						if (this.socialExpEnabled) {
							this.statScrollAnimation = false;
						} else {
							this.statScrollAnimation = !this.statScrollAnimation;
						}
					} else {
						this.statScrollAnimation = true;
					}
				};
				setInterval(cycleSlotMachine, 5000);
			}
		},
		toggleLightbox() {
			this.$emit('togglelightbox');
		}
	},
	watch: {
		matchingText(newValue, previousValue) {
			if (newValue !== previousValue && newValue !== '') {
				this.cycleStatsSlot();
			}
		},
		unreservedAmount(newValue, previousValue) {
			// set initial selected value for sub 25 loan if shown
			if (this.completeLoan && this.isBetween25And50) {
				this.selectedOption = Number(this.unreservedAmount).toFixed();
			} else if (newValue !== previousValue && previousValue === '' && newValue < 25) {
				this.selectedOption = parseInt(newValue, 10);
			}
		},
		isCompleteLoanActive() {
			if (this.isCompleteLoanActive && this.completeLoanView) {
				// eslint-disable-next-line
				this.$kvTrackEvent('Borrower profile', 'Complete loan', 'view-amount-left-cta', this.loanId, this.selectedOption);
				this.completeLoanView = false;
			}
		},
	},
	computed: {
		isInBasket() {
			// eslint-disable-next-line no-underscore-dangle
			return this.basketItems.some(item => item.__typename === 'LoanReservation' && item.id === this.loanId);
		},
		isMatchAtRisk() {
			const mockLoan = {
				loanAmount: this.loanAmount,
				loanFundraisingInfo: {
					fundedAmount: this.fundedAmount,
					reservedAmount: this.reservedAmount,
				},
				matchRatio: this.matchRatio,
				matchingText: this.matchingText,
			};
			return isMatchAtRisk(mockLoan);
		},
		prices() {
			// We don't want to open up $5 loan shares for loans with more than $25 at this time
			// IF we wanted to show this interface on loans with less than 25 remaining they would see the selector
			const minAmount = parseFloat(this.unreservedAmount < 25 ? this.minNoteSize : 25); // 25_hard_coded
			// limit at 20 price options
			const priceArray = buildPriceArray(parseFloat(this.unreservedAmount), minAmount).slice(0, 20);
			// eslint-disable-next-line
			if (this.completeLoan && !priceArray.includes(Number(this.unreservedAmount).toFixed())) {
				priceArray.push(Number(this.unreservedAmount).toFixed());
			}
			return priceArray;
		},
		lgScreenheadline() {
			if (this.isCompleteLoanActive) {
				return `${this.name}'s loan is almost funded!`;
			}
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
			if (this.isCompleteLoanActive) {
				return 'Lend now';
			}
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
		isLessThan25() {
			return this.unreservedAmount < 25 && this.unreservedAmount > 0;
		},
		isBetween25And50() {
			return this.unreservedAmount <= 50 && this.unreservedAmount > 25;
		},
		isBetween25And500() {
			return this.unreservedAmount < 500 && this.unreservedAmount >= 25;
		},
		isCompleteLoanActive() {
			if (this.completeLoan) {
				// eslint-disable-next-line
				return (this.isLessThan25) || (this.isBetween25And500 && Number(this.unreservedAmount).toFixed() === this.selectedOption);
			}
			return false;
		},
		isLendAmountButton() {
			return (this.lendButtonVisibility || this.state === 'lent-to') && this.isLessThan25;
		}
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
