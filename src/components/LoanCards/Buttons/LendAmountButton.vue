<template>
	<lend-button
		price="amountLeft"
		:loan-id="loanId"
		v-kv-track-event="['Lending', 'Add to basket (Partial Share)', 'lend-button-click', loanId, amountLeft]"
		@add-to-basket="addToBasket($event)"
	>
		Lend ${{ amountLeft }}<span v-if="showNow"> now</span>
	</lend-button>
</template>

<script>
import LendButton from './LendButton';

export default {
	components: {
		LendButton,
	},
	props: {
		loanId: {
			type: Number,
			default: null
		},
		loan: {
			type: Object,
			default: () => {}
		},
		showNow: {
			type: Boolean,
			default: false
		},
		amountLeft: {
			type: Number,
			default: 20
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
