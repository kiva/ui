<template>
	<div class="basket-items-list">
		<ul>
			<li v-for="loan in loans" :key="loan.id">
				<!-- Move basket-item-wrapper into a new component
				move entire div into new component -->
				<basket-item />
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
import CheckoutItemImg from '@/components/Checkout/CheckoutItemImg';

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
		CheckoutItemImg
	}
};
</script>

<style lang="scss">
@import 'settings';

.basket-items-list ul {
	list-style-type: none;
}

.reservation-info {
	color: $kiva-text-light;
}

</style>
