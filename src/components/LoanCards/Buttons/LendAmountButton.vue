<template>
	<lend-button
		price="amountLeft"
		:loan-id="loanId"
		@add-to-basket="$emit('add-to-basket', $event)"
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
		}
	},
	computed: {
		// TODO: we should swap this out for a prop if the parent component needs to calculate this anyway
		amountLeft() {
			const { loanAmount, loanFundraisingInfo } = this.loan;
			const { isExpiringSoon, fundedAmount, reservedAmount } = loanFundraisingInfo;
			let remainingAmount = parseFloat(loanAmount) - parseFloat(fundedAmount);
			if (!isExpiringSoon) {
				remainingAmount -= parseFloat(reservedAmount);
			}
			return parseInt(remainingAmount, 10);
		}
	}
};
</script>
