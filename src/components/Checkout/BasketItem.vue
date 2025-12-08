<template>
	<div v-show="loanVisible" class="basket-item-wrapper tw-flex tw-flex-col md:tw-flex-row tw-pb-5">
		<div class="tw-hidden md:tw-block tw-flex-none md:tw-mr-3 lg:tw-mr-4.5">
			<checkout-item-img
				data-testid="basket-loan-image"
				:disable-link="disableRedirects"
				:loan-id="loan.id"
				:name="loan.loan.name"
				:image-url="loan.loan.image.url"
			/>
		</div>
		<div class="tw-flex-auto borrower-info-wrapper">
			<div class="borrower-info" data-testid="basket-loan-info">
				<div class="tw-flex tw-mb-1">
					<h2 class="tw-text-h3 tw-flex-grow" data-testid="basket-loan-name">
						{{ loan.loan.name }} in {{ loan.loan.geocode.country.name }}
					</h2>
					<remove-basket-item
						class="md:tw-hidden tw-flex-none tw-ml-1 tw-mt-0.5 tw-h-1.5"
						:loan-id="loan.id"
						type="loan"
						@refreshtotals="onLoanUpdate($event)"
						@updating-totals="$emit('updating-totals', $event)"
					/>
				</div>
				<KvCartPill
					v-if="showPill"
					show-bg
					:custom-message="pillMessage"
					style="height: 32px;"
				>
					<template #icon>
						<EquityBadge
							v-if="isFirstLoan && !pillMessage.length"
							class="tw-h-3 tw-w-4 tw--mx-0.5"
						/>
						<IconChoice v-else />
					</template>
				</KvCartPill>
				<loan-matcher
					class="tw-mb-1"
					data-testid="basket-loan-matching-text"
					v-if="loan.loan.matchingText"
					:matching-text="loan.loan.matchingText"
				/>
				<loan-reservation
					class="tw-mb-1"
					data-testid="basket-loan-reservation-text"
					:is-expiring-soon="loan.loan.loanFundraisingInfo.isExpiringSoon"
					:is-funded="loan.isFunded"
					:expiry-time="loan.expiryTime"
				/>
				<team-attribution
					class="tw-mb-1 tw-mt-0.5"
					v-if="combinedTeams.length"
					:teams="combinedTeams"
					:loan-id="loan.id"
					:team-id="loanTeamAttributionId"
				/>
				<loan-promo-credits
					:applied-promo-credits="appliedPromoCredits"
				/>
			</div>
		</div>
		<div
			v-if="leftoverCreditAllocationLoanId === String(loan.id) && isCorporateCampaign"
			class="tw-w-full
					md:tw-w-auto
					md:tw-ml-3
					lg:tw-ml-6
					tw-mt-1.5
					md:tw-mt-0"
		>
			<div
				class="
					tw-bg-brand-50
					tw-rounded
					tw-p-2
			"
			>
				<span
					class="tw-text-action
							tw-block"
				>
					The remaining ${{ loan.price }} will be lent to this borrower.
				</span>
				<span
					class="tw-text-primary
							tw-block"
				>
					<u
						class="tw-cursor-pointer"
						@click="$emit('jump-to-loans')"
					>
						Choose another borrower
					</u>
				</span>
			</div>
		</div>
		<div
			v-else
			class="
				tw-flex-none
				tw-w-full
				md:tw-w-auto
				md:tw-ml-3
				lg:tw-ml-4.5
				tw-mt-1.5
				md:tw-mt-0
				loan-res-price-wrapper"
		>
			<loan-price
				data-testid="basket-loan-price-selector"
				:price="loan.price"
				:loan-id="loan.id"
				type="loan"
				:loan-amount="loan.loan.loanAmount"
				:min-amount="loan.loan.minNoteSize"
				:funded-amount="loan.loan.loanFundraisingInfo.fundedAmount"
				:reserved-amount="loan.loan.loanFundraisingInfo.reservedAmount"
				:is-expiring-soon="loan.loan.loanFundraisingInfo.isExpiringSoon"
				:enable-five-dollars-notes="enableFiveDollarsNotes"
				:is-logged-in="isLoggedIn"
				@refreshtotals="onLoanUpdate($event)"
				@updating-totals="$emit('updating-totals', $event)"
			/>
		</div>
	</div>
</template>

<script>
import { isCCPage } from '#src/util/urlUtils';
import CheckoutItemImg from '#src/components/Checkout/CheckoutItemImg';
import LoanMatcher from '#src/components/Checkout/LoanMatcher';
import LoanPromoCredits from '#src/components/Checkout/LoanPromoCredits';
import LoanReservation from '#src/components/Checkout/LoanReservation';
import LoanPrice from '#src/components/Checkout/LoanPrice';
import RemoveBasketItem from '#src/components/Checkout/RemoveBasketItem';
import TeamAttribution from '#src/components/Checkout/TeamAttribution';
import { getForcedTeamId, removeLoansFromChallengeCookie } from '#src/util/teamChallengeUtils';
import { KvCartPill } from '@kiva/kv-components';
import IconChoice from '#src/assets/icons/inline/achievements/icon_choice.svg';
import EquityBadge from '#src/assets/icons/inline/achievements/equity-badge.svg';

export default {
	name: 'BasketItem',
	components: {
		CheckoutItemImg,
		LoanMatcher,
		LoanPromoCredits,
		LoanReservation,
		LoanPrice,
		RemoveBasketItem,
		TeamAttribution,
		KvCartPill,
		IconChoice,
		EquityBadge,
	},
	inject: ['apollo', 'cookieStore'],
	emits: [
		'refreshtotals',
		'updating-totals',
		'jump-to-loans',
		'validateprecheckout',
		'removed-loan',
	],
	props: {
		disableRedirects: {
			type: Boolean,
			default: false
		},
		loan: {
			type: Object,
			default: () => {}
		},
		teams: {
			type: Array,
			default: () => []
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		isLoggedIn: {
			type: Boolean,
			default: false
		},
		contributesInAchievement: {
			type: Boolean,
			default: false
		},
		isFirstLoan: {
			type: Boolean,
			default: false
		},
		isMyKivaEnabled: {
			type: Boolean,
			default: false
		},
		userGoalAchieved: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			activateTimer: true,
			loanVisible: true,
			appendedTeams: [],
			forceTeamId: null
		};
	},
	computed: {
		isCorporateCampaign() {
			return isCCPage(this.$route);
		},
		creditsUsed() {
			return this.loan?.creditsUsed ?? [];
		},
		appliedPromoCredits() {
			if (this.creditsUsed.length) {
				const appliedCredits = this.creditsUsed.filter(credit => {
					return credit.creditType !== 'kiva_credit';
				});
				return appliedCredits.length ? appliedCredits : [];
			}
			return [];
		},
		leftoverCreditAllocationLoanId() {
			return this.cookieStore.get('lcaid');
		},
		combinedTeams() {
			return [...this.teams, ...this.appendedTeams];
		},
		loanTeamAttributionId() {
			if (this.forceTeamId) {
				return this.forceTeamId;
			}
			return this.loan.team ? this.loan.team.id : 0;
		},
		showPill() {
			return (this.isMyKivaEnabled && (this.contributesInAchievement || this.isFirstLoan))
				|| this.pillMessage.length > 0;
		},
		pillMessage() {
			if (this.userGoalAchieved) {
				return 'Supporting this loan reaches your annual goal!';
			}
			return '';
		}
	},
	watch: {
		teams: {
			handler() {
				this.forceTeamId = getForcedTeamId(
					this.cookieStore,
					this.loan.id,
					this.combinedTeams,
					this.appendedTeams
				);
			},
			immediate: true
		}
	},
	methods: {
		onLoanUpdate($event) {
			this.$emit('refreshtotals', $event);
			if ($event === 'removeLoan') {
				this.$emit('removed-loan', this.loan.id);
				this.loanVisible = false;
				removeLoansFromChallengeCookie(this.cookieStore, [this.loan.id]);
			}
		},
	},
	updated() {
		// check for zeroed out loan validate + refresh if present
		if (typeof this.loan.price !== 'undefined' && this.loan.price === '0.00') {
			this.$emit('validateprecheckout');
		}
	},
};
</script>
