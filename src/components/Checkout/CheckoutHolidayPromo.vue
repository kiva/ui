<template>
	<div class="checkout-holiday-promo">
		<kv-icon name="present" class="holiday-present-icon" />
		<div>
			Give hope this holiday season.
			<a
				href="#"
				@click.prevent.stop="addOnePrintKivaCard"
			>
				Add a $25 Kiva Card to your cart.
			</a>
		</div>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import shopAddOnePrintKivaCard from '@/graphql/mutation/shopAddOnePrintKivaCard.graphql';

export default {
	components: {
		KvIcon,
	},
	inject: ['apollo'],
	methods: {
		addOnePrintKivaCard() {
			this.$emit('updating-totals', true);
			this.apollo.mutate({
				mutation: shopAddOnePrintKivaCard,
			}).then(({ data }) => {
				if (!data.shop || !data.shop.addOnePrintKivaCard) {
					console.error(data);
					this.$emit('updating-totals', false);
					return;
				}
				this.$kvTrackEvent('promo', 'click', 'BasketKCUpsell');
				window.location.reload();
			}).catch(error => {
				console.error(error);
				this.$emit('updating-totals', false);
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
// Holiday Promo
.checkout-holiday-promo {
	display: flex;
	align-items: center;
	padding-left: 1.25rem;
	padding-right: 1.25rem;

	@include breakpoint(medium) {
		margin: $list-side-margin $list-side-margin 2rem;
		padding-left: rem-calc(90);
	}

	.holiday-present-icon {
		height: 1.25rem;
		width: 1.25rem;
		flex-shrink: 0;
		stroke-width: rem-calc(0.5);
		margin-right: 0.75rem;
	}
}
</style>
