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
					@validateprecheckout="$emit('validateprecheckout')"
					@refreshtotals="$emit('refreshtotals', $event)"
					@updating-totals="$emit('updating-totals', $event)"
				/>
			</li>
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
import BasketItem from '@/components/Checkout/BasketItem';
import DonationItem from '@/components/Checkout/DonationItem';
import KivaCardItem from '@/components/Checkout/KivaCardItem';
import { userUsLoanCheckout } from '@/util/optimizelyUserMetrics';

export default {
	name: 'BasketItemsList',
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
		}
	},
	components: {
		BasketItem,
		DonationItem,
		KivaCardItem
	},
	watch: {
		loans(loansInBasket) {
			// eslint-disable-next-line no-underscore-dangle
			const hasUsLoan = loansInBasket.some(reservation => reservation?.loan?.__typename === 'LoanDirect');
			userUsLoanCheckout(hasUsLoan);
		}
	},
};
</script>
