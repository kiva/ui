<template>
	<div class="basket-items-list" data-testid="basket-items-list">
		<ul>
			<li v-for="(loan, index) in loans" :key="loan.id">
				<basket-item
					:data-testid="`basket-loan-${index}`"
					:disable-redirects="disableRedirects"
					:loan="loan"
					:teams="teams"
					:enable-five-dollars-notes="enableFiveDollarsNotes"
					:is-logged-in="isLoggedIn"
					:contributes-in-achievement="isLoanContributingInAchievements(loan.id)"
					:is-first-loan="isFirstLoan(index)"
					:is-my-kiva-enabled="isMyKivaEnabled"
					:loan-contributes-to-goal="loansContributingToGoal[index]"
					:loading-goal-data="loadingGoalData"
					:has-goal="userGoal !== null && userGoal?.status === 'in-progress'"
					@validateprecheckout="$emit('validateprecheckout')"
					@refreshtotals="$emit('refreshtotals', $event)"
					@updating-totals="$emit('updating-totals', $event)"
					@jump-to-loans="$emit('jump-to-loans')"
					@removed-loan="$emit('removed-loan', $event)"
				/>
			</li>
			<deposit-incentive-upsell
				v-if="showIncentiveUpsell"
				class="tw-mb-4"
				data-testid="basket-deposit-incentive-upsell"
				:goal="incentiveGoal"
				:progress="loanReservationTotal"
				:exclude-loan-ids="loans.map(loan => loan.id)"
				@adding-loan="$emit('updating-totals', true)"
				@done-adding="$emit('refreshtotals')"
			/>
			<li v-for="(kivaCard, index) in kivaCards" :key="kivaCard.id">
				<kiva-card-item
					:data-testid="`basket-kiva-card-${index}`"
					:kiva-card="kivaCard"
					@refreshtotals="$emit('refreshtotals', $event)"
					@updating-totals="$emit('updating-totals', $event)"
				/>
			</li>
			<li v-for="(donation, index) in donations" :key="donation.id">
				<donation-item
					:data-testid="`basket-donation-${index}`"
					:donation="donation"
					:loan-count="loans.length"
					:kiva-cards-count="kivaCards.length"
					:loan-reservation-total="loanReservationTotal"
					@refreshtotals="$emit('refreshtotals')"
					@updating-totals="$emit('updating-totals', $event)"
				/>
			</li>
		</ul>
	</div>
</template>

<script>
import { inject } from 'vue';
import useBadgeData, { ID_SUPPORT_ALL } from '#src/composables/useBadgeData';
import BasketItem from '#src/components/Checkout/BasketItem';
import DonationItem from '#src/components/Checkout/DonationItem';
import KivaCardItem from '#src/components/Checkout/KivaCardItem';
import DepositIncentiveUpsell from '#src/components/Checkout/DepositIncentiveUpsell';
import { userUsLoanCheckout } from '#src/util/optimizelyUserMetrics';
import useGoalData from '#src/composables/useGoalData';

export default {
	name: 'BasketItemsList',
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
		loans: {
			type: Array,
			default: () => []
		},
		donations: {
			type: Array,
			default: () => [
				{
					__typename: 'Donation',
					id: 0,
					isTip: false,
					isUserEdited: false,
					price: '0.00',
					metadata: null
				}
			]
		},
		kivaCards: {
			type: Array,
			default: () => []
		},
		teams: {
			type: Array,
			default: () => []
		},
		loanReservationTotal: {
			type: Number,
			default: 0,
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		isLoggedIn: {
			type: Boolean,
			default: false
		},
		showIncentiveUpsell: {
			type: Boolean,
			default: false
		},
		incentiveGoal: {
			type: Number,
			default: 0
		},
		possibleAchievementProgress: {
			type: Array,
			default: () => ([])
		},
		isMyKivaEnabled: {
			type: Boolean,
			default: false
		},
		lenderTotalLoans: {
			type: Number,
			default: 0
		},
		hasEverLoggedIn: {
			type: Boolean,
			default: false
		},
		isNextStepsExpEnabled: {
			type: Boolean,
			default: false
		},
		goalsV2Enabled: {
			type: Boolean,
			default: false
		}
	},
	components: {
		BasketItem,
		DonationItem,
		KivaCardItem,
		DepositIncentiveUpsell,
	},
	data() {
		return {
			loadingGoalData: true,
			basketGoalProgress: 0,
		};
	},
	watch: {
		loans(loansInBasket) {
			// eslint-disable-next-line no-underscore-dangle
			const hasUsLoan = loansInBasket.some(reservation => reservation?.loan?.__typename === 'LoanDirect');
			userUsLoanCheckout(hasUsLoan);

			if (this.isNextStepsExpEnabled) {
				this.loadAndCalculateGoalProgress();
			}
		}
	},
	methods: {
		isLoanContributingInAchievements(loanId) {
			const achievementProgress = this.possibleAchievementProgress.filter(
				achievement => achievement?.contributingLoanIds?.includes(loanId.toString())
			);

			return achievementProgress.some(a => !a?.preCheckoutTier || a?.postCheckoutTier !== a?.preCheckoutTier);
		},
		isFirstLoan(idx) {
			if (idx !== 0 || this.lenderTotalLoans !== 0) return false;

			return this.isLoggedIn || (!this.isLoggedIn && !this.hasEverLoggedIn);
		},
		async loadAndCalculateGoalProgress() {
			await this.loadGoalData({ loans: this.loans, yearlyProgress: this.goalsV2Enabled });
			// Calculate progress including basket loans (don't increment counter, just check current state)
			const year = this.goalsV2Enabled ? new Date().getFullYear() : null;
			this.basketGoalProgress = await this.getPostCheckoutProgressByLoans({
				loans: this.loans.map(loan => ({ id: loan.id })),
				addBasketLoans: true,
				year,
			});
		}
	},
	computed: {
		/**
		 * Returns an array of booleans indicating which loans contribute to completing the user's goal
		 * Only the first X loans needed to reach the goal target will be true
		 * @returns {Boolean[]} - Array of booleans, one per loan in basket
		 */
		loansContributingToGoal() {
			const goal = this.userGoal;
			if (!goal || goal.status !== 'in-progress') {
				return this.loans.map(() => false);
			}

			const target = goal.target || 0;
			const currentProgress = this.goalProgress || 0;
			const loansNeededForGoal = Math.max(0, target - currentProgress);

			// If no loans needed (goal already complete), return all false
			if (loansNeededForGoal <= 0) {
				return this.loans.map(() => false);
			}

			// First check: basket must complete the goal
			if (this.basketGoalProgress < target) {
				return this.loans.map(() => false);
			}

			const goalCategory = goal.category || '';

			// For "support-all" goal, any loan counts - just check position
			if (goalCategory === ID_SUPPORT_ALL) {
				return this.loans.map((_, index) => index < loansNeededForGoal);
			}

			// For category-specific goals, track which loans contribute
			let qualifyingCount = 0;
			return this.loans.map(loan => {
				const loanJourneys = this.getJourneysByLoan(loan?.loan || {});
				const isLoanInGoalCategory = loanJourneys.some(journey => journey === goalCategory);

				if (!isLoanInGoalCategory) return false;

				// This loan contributes if we still need more loans
				const contributes = qualifyingCount < loansNeededForGoal;
				if (contributes) {
					qualifyingCount += 1;
				}
				return contributes;
			});
		}
	},
	setup() {
		const apollo = inject('apollo');
		const {
			loadGoalData,
			userGoal,
			goalProgress,
			getPostCheckoutProgressByLoans,
		} = useGoalData({ apollo });

		const { getJourneysByLoan } = useBadgeData({ apollo });

		return {
			loadGoalData,
			userGoal,
			goalProgress,
			getPostCheckoutProgressByLoans,
			getJourneysByLoan,
		};
	},
	async mounted() {
		if (this.isNextStepsExpEnabled) {
			await this.loadAndCalculateGoalProgress();
			this.loadingGoalData = false;
		} else {
			this.loadingGoalData = false;
		}
	},
};
</script>
