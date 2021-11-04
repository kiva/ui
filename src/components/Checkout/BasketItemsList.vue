<template>
	<div class="basket-items-list">
		<ul>
			<li v-for="loan in loans" :key="loan.id">
				<basket-item
					:disable-redirects="disableRedirects"
					:loan="loan"
					:teams="teams"
					@validateprecheckout="$emit('validateprecheckout')"
					@refreshtotals="$emit('refreshtotals', $event)"
					@updating-totals="$emit('updating-totals', $event)"
				/>
			</li>
			<li v-for="kivaCard in kivaCards" :key="kivaCard.id">
				<kiva-card-item
					:kiva-card="kivaCard"
					@refreshtotals="$emit('refreshtotals', $event)"
					@updating-totals="$emit('updating-totals', $event)"
				/>
			</li>
			<li v-for="donation in donations" :key="donation.id">
				<donation-item
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

export default {
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
	},
	components: {
		BasketItem,
		DonationItem,
		KivaCardItem
	}
};
</script>
