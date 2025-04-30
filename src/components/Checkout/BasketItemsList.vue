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
					:enable-huge-amount="enableHugeAmount"
					:is-logged-in="isLoggedIn"
					:contributes-in-achievement="isLoanContributingInAchievements(loan.id)"
					:is-first-loan="isFirstLoan"
					:is-my-kiva-enabled="isMyKivaEnabled"
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
					:loan-reservation-total="loanReservationTotal"
					@refreshtotals="$emit('refreshtotals')"
					@updating-totals="$emit('updating-totals', $event)"
				/>
			</li>
		</ul>
	</div>
</template>

<script>
import BasketItem from '#src/components/Checkout/BasketItem';
import DonationItem from '#src/components/Checkout/DonationItem';
import KivaCardItem from '#src/components/Checkout/KivaCardItem';
import DepositIncentiveUpsell from '#src/components/Checkout/DepositIncentiveUpsell';
import { userUsLoanCheckout } from '#src/util/optimizelyUserMetrics';

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
					price: '0.00'
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
		enableHugeAmount: {
			type: Boolean,
			default: false,
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
		isFirstLoan: {
			type: Boolean,
			default: false
		},
		isMyKivaEnabled: {
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
	watch: {
		loans(loansInBasket) {
			// eslint-disable-next-line no-underscore-dangle
			const hasUsLoan = loansInBasket.some(reservation => reservation?.loan?.__typename === 'LoanDirect');
			userUsLoanCheckout(hasUsLoan);
		}
	},
	methods: {
		isLoanContributingInAchievements(loanId) {
			const achievementProgress = this.possibleAchievementProgress.filter(
				achievement => achievement?.contributingLoanIds?.includes(loanId.toString())
			);

			return !this.isLoggedIn || achievementProgress.some(a => a?.postCheckoutTier !== a?.preCheckoutTier);
		},
	}
};
</script>
