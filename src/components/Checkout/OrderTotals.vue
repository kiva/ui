<template>
	<div class="order-totals">
		<div v-if="showCredit" class="kiva-credit">
			<a class="remove-credit">X</a> <strong>Kiva Credit: <span>({{ kivaCredit }})</span></strong>
		</div>
		<div class="order-total">
			<strong>Total: <span>{{ orderTotal }}</span></strong>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';

export default {
	props: {
		totals: {
			type: Object,
			default: () => {}
		}
	},
	computed: {
		showCredit() {
			return parseFloat(this.totals.creditAvailableTotal) > 0;
		},
		kivaCredit() {
			return numeral(this.totals.kivaCreditAppliedTotal).format('$0,0.00');
		},
		orderTotal() {
			return numeral(this.totals.creditAmountNeeded).format('$0,0.00');
		}
	}
};
</script>

<style>

</style>
