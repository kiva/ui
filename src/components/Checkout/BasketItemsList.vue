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
			<li v-for="donation in donations" :key="donation.id">
				<donation-item
					:donation="donation"
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
			default: () => []
		}
	},
	components: {
		BasketItem,
		DonationItem
	}
};
</script>

<style lang="scss">
@import 'settings';

.basket-items-list {
	margin: $list-side-margin;
}

.basket-items-list ul {
	list-style-type: none;
}

</style>
