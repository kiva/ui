<template>
	<div class="checkout-holiday-promo tw-flex tw-justify-center tw-mb-4">
		<kv-icon name="present" class="holiday-present-icon tw-w-3 tw-h-3 tw-mr-2" />
		<div>
			Give hope this holiday season.
			<button
				class="tw-text-link"
				@click="addOnePrintKivaCard"
			>
				Add a $25 Kiva Card to your cart.
			</button>
		</div>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import shopAddOnePrintKivaCard from '@/graphql/mutation/shopAddOnePrintKivaCard.graphql';

export default {
	name: 'CheckoutHolidayPromo',
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
