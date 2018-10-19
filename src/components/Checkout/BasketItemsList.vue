<template>
	<div class="basket-items-list">
		<ul>
			<li v-for="loan in loans" :key="loan.id">
				<basket-item
					:loan="loan"
					@refreshtotals="$emit('refreshtotals', $event)"
					@updating-totals="$emit('updating-totals', $event)"

				/>
			</li>
			<li v-for="kivaCard in KivaCards" :key="kivaCard.id">
				<kiva-card
					:kiva-card="kivaCard"
				/>
			</li>
			<li v-for="donation in donations" :key="donation.id">
				<donation-item
					:donation="donation"
					:loan-count="loans.length"
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

export default {
	props: {
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
		kivaCard: {
			type: Array,
			default: () => []
		}
	},
	components: {
		BasketItem,
		DonationItem
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.basket-items-list {
	@include breakpoint(medium) {
		margin: $list-side-margin $list-side-margin 2rem;
	}
}

.basket-items-list ul {
	list-style-type: none;
}
</style>
