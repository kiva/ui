<template>
	<div class="order-totals">
		<div v-if="showCredit" class="kiva-credit">
			<a class="remove-credit" @click.prevent.stop="removeCredit('kiva_credit')">X</a>
			<a class="add-credit" @click.prevent.stop="addCredit('kiva_credit')">Apply</a>
			<strong>Kiva Credit: <span>({{ kivaCredit }})</span></strong>
		</div>
		<div class="order-total">
			<strong>Total: <span>{{ orderTotal }}</span></strong>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import addCreditByType from '@/graphql/mutation/shopAddCreditByType.graphql';
import removeCreditByType from '@/graphql/mutation/shopRemoveCreditByType.graphql';

export default {
	inject: ['apollo'],
	props: {
		totals: {
			type: Object,
			default: () => {}
		}
	},
	computed: {
		showCredit() {
			return parseFloat(this.totals.creditAvailableTotal) > 0 || parseFloat(this.totals.kivaCreditToReapply) > 0;
		},
		kivaCredit() {
			return numeral(this.totals.kivaCreditAppliedTotal).format('$0,0.00');
		},
		orderTotal() {
			return numeral(this.totals.creditAmountNeeded).format('$0,0.00');
		}
	},
	methods: {
		addCredit(type) {
			this.apollo.mutate({
				mutation: addCreditByType,
				variables: {
					creditType: type
				}
			}).then(response => {
				console.log(response);
				this.$emit('refreshtotals');
			}).catch(error => {
				console.log(error);
			});
		},
		removeCredit(type) {
			this.apollo.mutate({
				mutation: removeCreditByType,
				variables: {
					creditType: type
				}
			}).then(response => {
				console.log(response);
				this.$emit('refreshtotals');
			}).catch(error => {
				console.log(error);
			});
		}
	}
};
</script>

<style>

</style>
