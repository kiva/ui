<template>
	<div class="basket-items-list">
		<ul>
			<li v-for="loan in loans" :key="loan.id">
				<basket-item
					:loan="loan"
				/>
			</li>
			<li v-for="donation in donations" :key="donation.id">
				<label for="donation">Help Kiva reach more borrowers around the world:</label>
				<input type="input" name="donation" id="donation" value="">{{ donation.price }}
			</li>
		</ul>
		<hr>
	</div>
</template>

<script>
import BasketItem from '@/components/Checkout/BasketItem';

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
		BasketItem
	}
};
</script>

<style lang="scss">
@import 'settings';

.basket-items-list ul {
	list-style-type: none;
}

</style>
