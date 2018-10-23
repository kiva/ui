<template>
	<div class="basket-item-wrapper row">
		<span class="small-3 medium-2 large-1">
			<!-- IMAGE -->
			<span class="donation-icon">
				<!-- This will have if condions for images based on kiva card type -->
				<kv-icon class="dedicate-heart" name="dedicate-heart" />
			</span>
		</span>
		<span class="small-9 medium-7 large-9 kiva-card-info-wrapper">
			<!-- Main line text -->
			<span class="kiva-card-info featured-text">
				<!-- Postal Kiva Card -->
				<span v-if="postal">Print-it-yourself </span>
				<!-- Print Kiva Card -->
				<span v-if="print">Postal delivery </span>
				<!-- Donation to Kiva -->
				<!-- Email Kiva Card -->
				<span v-if="email">Email delivery </span>
				<span>Kiva Card</span>
				<kv-icon
					class="edit-pencil-icon"
					name="pencil"/>
			</span>
		</span>
		<span class="small-3 show-for-small-only"></span>
		<span class="small-9 medium-3 large-2 price-wrapper medium-text-font-size">
			<!-- Kiva card amount dropdown section -->
			<loan-price
				@refreshtotals="onLoanUpdate($event)"
				@updating-totals="$emit('updating-totals', $event)"
			/>
		</span>
	</div>

</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import LoanPrice from '@/components/Checkout/LoanPrice';

export default {
	components: {
		KvIcon,
		LoanPrice
	},
	props: {
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.basket-item-wrapper {
	margin-bottom: rem-calc(30);
	padding-right: rem-calc(20);
}

.kiva-card-info-wrapper {
	padding-left: rem-calc(10);
}

.edit-pencil-icon {
	width: 1rem;
	height: 1rem;
	margin: 0 0.4rem 0 0.6rem;
	cursor: pointer;

	@include breakpoint(medium) {
		width: 0.8rem;
		height: 0.8rem;
		margin: 0 0.2rem 0 0.8rem;
	}
}

.price-wrapper {
	padding-left: rem-calc(10);
}

.dedicate-heart {
	border: 1px solid $light-gray;
	height: rem-calc(71);
	width: rem-calc(71);
	padding: rem-calc(4);

	@include breakpoint(medium) {
		height: rem-calc(55);
		width: rem-calc(55);
	}
}
</style>
