<template>
	<div
		ref="wrapper"
		:class="['lg:tw-mb-1.5', { 'md:tw-px-4': isSticky }]"
		:style="wrapperStyle"
	>
		<kv-atb-modal-container
			:added-loan="addedLoan"
		/>
		<div
			:class="[
				'tw-w-full',
				'tw-flex tw-flex-col',
				'tw-left-0 tw-bottom-0',
				{
					'md:tw-static': !isSticky,
				},
				'lg:tw-static',
				{
					'tw-fixed tw-z-sticky': isSticky
				}
			]"
		>
			<kv-grid
				:class="[
					'tw-grid-cols-12',
					{
						'md:tw-rounded-b': !isSticky,
						'md:tw-border-none': !isSticky,
						'md:tw-px-3': !isSticky,
						'md:tw-px-4': isSticky,
						'tw-bg-transparent md:tw-bg-primary': !isSticky,
						'tw-bg-primary': isSticky,
						'tw-border-t tw-border-tertiary tw-px-2.5': isSticky
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
						'lg:tw-pt-1 lg:tw-pb-1',
					]"
				>
					<p class="tw-text-h3 tw-pt-3 lg:tw-mb-3 tw-hidden lg:tw-inline-block">
						{{ lgScreenheadline }}
					</p>
					<span class="tw-flex tw-flex-wrap tw-pb-1 lg:tw-pb-2 tw-relative">
						<!-- Highlighted matching text mobile  -->
						<!-- padding-left class makes room for the sparkle icon
						and makes sure long match text isnt covered -->
						<span
							class="tw-line-clamp-1 match-text tw-mb-0.5 md:tw-hidden tw-pl-3"
							v-if="matchingHighlightExpShown"
						>{{ matchRatio + 1 }}x matched by {{ matchingText }}!</span>
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
									class="tw-mr-2.5 tw-min-w-12"
									data-testid="bp-lend-cta-amount-dropdown"
									v-model="selectedOption"
									v-kv-track-event="[
										'Lending',
										'click-Modify loan amount',
										'open dialog'
									]"
									@update:model-value="trackLendAmountSelection"
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
								<complete-loan-wrapper :is-complete-loan-active="showSparkles">
									<template #button>

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
											v-if="isLentTo && !isLessThan25"
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
											:complete-loan="isCompleteLoanActive"
											v-if="isLendAmountButton && !enableFiveDollarsNotes"
										/>

										<!-- Adding to basket button -->
										<kv-ui-button
											v-if="isAdding"
											class="tw-inline-flex tw-flex-1"
											data-testid="bp-lend-cta-adding-to-basket-button"
										>
											Adding to basket...
										</kv-ui-button>

									</template>
								</complete-loan-wrapper>
							</fieldset>
						</form>
						<!-- Continue to checkout button -->
						<kv-ui-button
							v-if="state === 'basketed'"
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
								status
							]"
						>
							{{ ctaButtonText }}
						</kv-ui-button>

						<!-- Matching text bubble sparkle  -->
						<span
							:class="[
								'tw-flex',
								'tw-items-center',
								'tw-justify-center',
								'tw-w-4',
								'tw-h-4',
								{
									'tw-absolute': isSticky
								},
								'tw-left-0',
								'tw-top-[0.15rem]',
								'md:tw-top-auto',
								'tw-bottom-auto',
								'md:tw-bottom-2']"
							v-if="matchingHighlightExpShown"
						>
							<span class="match-text tw-z-1 tw-mr-0.5">{{ matchRatio + 1 }}x </span>
							<kv-icon name="sparkle-icon" class="tw-absolute tw-h-full tw-w-full" />
						</span>

						<!-- Highlighted matching text desktop  -->
						<!-- padding-left class makes room for the sparkle icon
						and makes sure long match text isnt covered -->
						<span
							class="md:tw-line-clamp-1 match-text tw-mt-0.5 tw-hidden md:tw-block tw-pl-3"
							v-if="matchingHighlightExpShown"
						>{{ matchRatio + 1 }}x matched by {{ matchingText }}!</span>

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
						class="lg:tw-block tw-border-tertiary tw-w-full tw-my-2"
						:class="[
							{
								'tw-hidden': isSticky,
								'tw-block': !isSticky,
							}
						]"
					>
					<div
						class="lg:tw-block tw-flex lg:tw-justify-center tw-w-full"
						:class="[
							{
								'tw-justify-between': isLoggedIn,
								'tw-justify-end': !isLoggedIn,
								'tw-hidden': isSticky,
							}
						]"
					>
						<loan-bookmark
							v-if="isLoggedIn"
							data-testid="bp-lend-cta-loan-bookmark"
							:loan-id="loanId"
							class="tw-inline-block lg:tw-hidden"
						/>
						<jump-links
							class="tw-block lg:tw-mb-1.5 md:tw-mb-3"
							data-testid="bp-lend-cta-jump-links"
						/>
					</div>
				</div>
			</kv-grid>

			<transition
				enter-active-class="tw-transition-transform tw-duration-700 tw-delay-300"
				:enter-from-class="transitionEnterClasses"
				enter-to-class="tw-transform tw-translate-y-0 md:tw-translate-y-0 lg:tw-translate-y-0"
			>
				<!-- Hide grid on mobile when matchingHighlightExpShown is on -->
				<kv-grid
					v-show="lenderCountVisibility || matchingTextVisibility"
					key="grid"
					:class="[
						'tw-grid-cols-12',
						'tw-order-first',
						'tw-w-full',
						{
							'tw-bottom-14': freeCreditWarning || allSharesReserved,
							'tw-bottom-8': !freeCreditWarning && !allSharesReserved,
						},
						{
							'md:tw-relative': !isSticky,
							'md:tw-bottom-0': !isSticky,
							'md:tw-order-none': !isSticky,
							'lg:tw-px-3': !isSticky,
							'md:tw-px-4': isSticky,
							'tw-px-2.5 tw-absolute': isSticky
						},
						'lg:tw-px-0',
						{
							'tw-hidden': matchingHighlightExpShown,
							'md:tw-grid': matchingHighlightExpShown
						}
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
								'tw-relative': isSticky,
								'md:tw-mb-0': !isSticky,
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
							enter-active-class="tw-transition-all tw-duration-1000"
							enter-from-class="tw-transform tw--translate-y-2 tw-opacity-0"
							enter-to-class="tw-transform tw-translate-y-0 tw-opacity-full"
							leave-active-class="tw-transition-all tw-duration-1000"
							leave-from-class="tw-transform tw-translate-y-0 tw-opacity-full"
							leave-to-class="tw-transform tw-translate-y-2 tw-opacity-0"
						>
							<span
								v-if="currentSlotStat === 'lenderCount'"
								class="tw-inline-block"
								data-testid="bp-lend-cta-powered-by-text"
								key="numLendersStat"
							>
								<!-- eslint-disable-next-line max-len -->
								<kv-material-icon class="tw-w-2.5 tw-h-2.5 tw-pointer-events-none tw-inline-block tw-align-middle" :icon="mdiLightningBolt" /><span class="tw-align-middle">powered by {{ numLenders }} lenders</span>
							</span>

							<span
								v-else-if="currentSlotStat === 'matchingText'"
								class="tw-inline-block"
								data-testid="bp-lend-cta-matched-text"
								key="loanMatchingText"
							>
								<!-- eslint-disable-next-line max-len -->
								<span class="tw-text-h3 tw-inline-block tw-pr-1 tw-align-middle">🎉</span>{{ matchRatio + 1 }}X MATCHED LOAN
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
import { gql } from 'graphql-tag';
import { setLendAmount, INVALID_BASKET_ERROR } from '#src/util/basketUtils';
import {
	getDropdownPriceArray,
	isMatchAtRisk,
	isLessThan25,
	isBetween25And500,
	getLendCtaSelectedOption,
}	from '#src/util/loanUtils';
import { formatPossessiveName } from '#src/util/stringParserUtils';
import { createIntersectionObserver } from '#src/util/observerUtils';
import {
	getExperimentSettingCached,
	trackExperimentVersion
} from '#src/util/experiment/experimentUtils';

import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';

import JumpLinks from '#src/components/BorrowerProfile/JumpLinks';
import LoanBookmark from '#src/components/BorrowerProfile/LoanBookmark';
import LendAmountButton from '#src/components/LoanCards/Buttons/LendAmountButton';
import CompleteLoanWrapper from '#src/components/BorrowerProfile/CompleteLoanWrapper';

import KvIcon from '#src/components/Kv/KvIcon';
import {
	KvSelect as KvUiSelect, KvMaterialIcon, KvButton as KvUiButton, KvGrid
} from '@kiva/kv-components';
import { setChallengeCookieData } from '#src/util/teamChallengeUtils';
import basketModalMixin from '#src/plugins/basket-modal-mixin';
import KvAtbModalContainer from '#src/components/WwwFrame/Header/KvAtbModalContainer';

export default {
	name: 'LendCta',
	inject: ['apollo', 'cookieStore'],
	mixins: [basketModalMixin],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false,
		},
		teamData: {
			type: Object,
			default: null,
		},
	},
	components: {
		LendAmountButton,
		KvGrid,
		KvIcon,
		KvMaterialIcon,
		KvUiButton,
		KvUiSelect,
		JumpLinks,
		LoanBookmark,
		CompleteLoanWrapper,
		KvAtbModalContainer,
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
			slotMachineInterval: null,
			currentSlotStat: '',
			matchingHighlightExpShown: false,
			inPfp: false,
			userBalance: undefined,
			loan: null,
			basketSize: 0,
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
						inPfp
						matchingText
						matchRatio
						gender
						borrowerCount
						... on LoanPartner {
							themes
						}
						unreservedAmount @client
						loanFundraisingInfo {
							id
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
					nonTrivialItemCount
				}
				my {
					id
					userAccount {
						id
						balance
					}
				}
				general {
					uiExperimentSetting(key: "matching_highlight") {
						key
						value
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

			this.loan = loan;
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
			this.inPfp = loan?.inPfp ?? false;
			this.userBalance = result?.data?.my?.userAccount?.balance;
			if (this.status === 'fundraising' && this.numLenders > 0) {
				this.lenderCountVisibility = true;
			}
			this.basketSize = result.data?.shop?.nonTrivialItemCount || 0;

			// Start cycling the stats slot now that loan data is available
			this.cycleStatsSlot();

			// Load matching experiment when data is available
			this.initializeMatchingHighlightExp();
		},
	},
	methods: {
		async addToBasket() {
			if (this.teamData?.id) {
				const challenge = {
					teamId: this.teamData.id,
					teamName: this.teamData?.name ?? '',
					loanId: this.loanId,
				};
				setChallengeCookieData(this.cookieStore, challenge);
			}
			const amount = isLessThan25(this.unreservedAmount) ? this.unreservedAmount : this.selectedOption;
			this.isAdding = true;
			setLendAmount({
				amount,
				apollo: this.apollo,
				loanId: this.loanId,
			}).then(() => {
				this.isAdding = false;
				this.$kvTrackEvent('Lending', 'Add to basket', this.ctaButtonText);
				if (this.isCompleteLoanActive) {
					// eslint-disable-next-line max-len
					this.$kvTrackEvent('Borrower profile', 'Complete loan', 'click-amount-left-cta', this.loanId, this.selectedOption);
				}
				// Show modal after 1s (Defined in CSS)
				setTimeout(() => {
					this.formatAddedLoan();
				}, 1000);
			}).catch(e => {
				if (e?.message !== INVALID_BASKET_ERROR) {
					this.$kvTrackEvent('borrower-profile', 'add-to-basket', 'Failed to add loan. Please try again.');
				}
				this.isAdding = false;
				const msg = e[0]?.extensions?.code === 'reached_anonymous_basket_limit' && e[0]?.message;
				this.$showTipMsg(msg, 'error');
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
			// Function can be skipped if slot machine interval is already set
			if (this.slotMachineInterval) {
				return;
			}

			// Change which stat is displayed in the stats slot
			const cycleSlotMachine = () => {
				const possibleStats = [];
				// Add lender count
				if (this.status === 'fundraising' && this.numLenders > 0) {
					possibleStats.push('lenderCount');
				}
				// Add matching text
				if (this.status === 'fundraising' && this.matchingText.length && !this.isMatchAtRisk) {
					possibleStats.push('matchingText');
				}
				// Cycle through the possible stats in the order they were added.
				// If current slot stat is no longer in the possible stat list, this will cycle back to the first stat.
				let nextStatIndex = possibleStats.indexOf(this.currentSlotStat) + 1;
				nextStatIndex = nextStatIndex >= possibleStats.length ? 0 : nextStatIndex;
				this.currentSlotStat = possibleStats[nextStatIndex] ?? '';
			};

			// Set initial stat
			cycleSlotMachine();
			// Start cycling
			this.slotMachineInterval = setInterval(cycleSlotMachine, 5000);
		},
		async initializeMatchingHighlightExp() {
			await this.apollo.query({ query: experimentAssignmentQuery, variables: { id: 'matching_highlight' } });
			const matchingHighlightExpData = getExperimentSettingCached(this.apollo, 'matching_highlight');
			// Tracking for EXP-ACK-538-Mar2023
			if (matchingHighlightExpData?.enabled && this.matchingTextVisibility) {
				const { version } = trackExperimentVersion(
					this.apollo,
					this.$kvTrackEvent,
					'borrower-profile',
					'matching_highlight',
					'EXP-ACK-538-Mar2023',
					`${this.matchRatio + 1}x`
				);
				if (version) {
					this.matchingHighlightExpShown = version === 'b';
				}
			}
		},
		formatAddedLoan() {
			const addedLoan = {
				id: this.loanId,
				name: this.name ?? '',
				gender: this.loan?.gender ?? '',
				borrowerCount: this.loan?.borrowerCount ?? 1,
				themes: this.loan?.themes ?? [],
				basketSize: this.basketSize,
			};
			this.handleCartModal(addedLoan);
		}
	},
	watch: {
		matchingText(newValue, previousValue) {
			if (newValue !== previousValue && newValue !== '') {
				this.cycleStatsSlot();
			}
		},
		unreservedAmount(newValue, previousValue) {
			if (newValue !== previousValue && previousValue === '') {
				this.selectedOption = getLendCtaSelectedOption(
					this.cookieStore,
					this.enableFiveDollarsNotes,
					this.$route.query.utm_campaign,
					newValue,
					this.userBalance,
				);
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
		borrowerPossessiveName() {
			return formatPossessiveName(this.name);
		},
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
			// limit price options
			const priceArray = getDropdownPriceArray(this.unreservedAmount, minAmount, this.enableFiveDollarsNotes, this.inPfp, this.isLoggedIn); // eslint-disable-line max-len

			if (this.isCompleteLoanActive && !priceArray.includes(Number(this.unreservedAmount).toFixed())) {
				priceArray.push(Number(this.unreservedAmount).toFixed());
			}
			return priceArray;
		},
		lgScreenheadline() {
			if (this.showSparkles) {
				return `${this.borrowerPossessiveName} loan is almost funded!`;
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
			if (this.showSparkles) {
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
			return '';
		},
		isLessThan25() {
			if (this.enableFiveDollarsNotes) return false; // NOTE: for $5 dollars notes we need to show the dropdown
			return isLessThan25(this.unreservedAmount);
		},
		isLentTo() {
			return this.state === 'lent-to';
		},
		isCompleteLoanActive() {
			return isLessThan25(this.unreservedAmount) || isBetween25And500(this.unreservedAmount);
		},
		showSparkles() {
			return this.isCompleteLoanActive && Number(this.unreservedAmount).toFixed() === Number(this.selectedOption).toFixed(); // eslint-disable-line max-len
		},
		isLendAmountButton() {
			return (this.lendButtonVisibility || this.state === 'lent-to') && (isLessThan25(this.unreservedAmount)); // eslint-disable-line max-len
		},
	},
	mounted() {
		this.createWrapperObserver();
	},
	beforeUnmount() {
		this.destroyWrapperObserver();
	},
};

</script>

<style lang="postcss" scoped>
.match-text {
	/* TODO make this color a variable */
	color: #CE4A00;
	@apply tw-w-full tw-text-small tw-text-center tw-font-medium;
}
</style>
