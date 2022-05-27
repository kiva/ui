<template>
	<lend-button
		:price="amountLeft"
		:loan-id="loanId"
		@add-to-basket="addToBasket($event)"
	>
		Lend ${{ amountValue }}<span v-if="showNow"> now</span>
	</lend-button>
</template>

<script>
import LendButton from './LendButton';

export default {
	name: 'LendAmountButton',
	components: {
		LendButton,
	},
	props: {
		loanId: {
			type: Number,
			default: null
		},
		showNow: {
			type: Boolean,
			default: false
		},
		amountLeft: {
			type: [Number, String],
			default: 20
		}
	},
	computed: {
		amountValue() {
			return parseFloat(this.amountLeft).toFixed();
		}
	},
	methods: {
		addToBasket(event) {
			// eslint-disable-next-line max-len
			this.$kvTrackEvent('Lending', 'Add to basket (Partial Share)', 'lend-button-click', this.loanId, this.amountLeft);
			this.$emit('add-to-basket', event);
		}
	}
};
</script>
