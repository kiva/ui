<template>
	<figure>
		<h4 class="tw-mb-0.5" :class="{ 'progress-group-amount-low': amountLow }">
			{{ fundingText }}
		</h4>
		<kv-progress-bar
			class="tw-mb-1.5 lg:tw-mb-1"
			aria-label="Percent the loan has funded"
			:value="progressPercent * 100"
		/>
	</figure>
</template>

<script>
import numeral from 'numeral';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';

export default {
	name: 'LoanProgressGroup',
	components: {
		KvProgressBar,
	},
	props: {
		moneyLeft: {
			type: String,
			default: '0.00',
		},
		progressPercent: {
			type: Number,
			default: 0,
		},
		timeLeft: {
			type: String,
			default: '',
		},
		enableLoanCardExp: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		numeralLeft() {
			return numeral(this.moneyLeft);
		},
		amountLow() {
			// Changing UI state based on amount left is currently under experiment
			return this.enableLoanCardExp && this.numeralLeft.value() < 100;
		},
		fundingText() {
			const formattedMoneyLeft = this.numeralLeft.format('$0,0[.]00');
			const formattedTimeLeft = `${this.timeLeft !== '' ? `. ${this.timeLeft}` : ''}`;
			// Some time left strings already include an exclamation mark
			const exclamationMark = this.amountLow && !formattedTimeLeft.includes('!') ? '!' : '';
			return `${formattedMoneyLeft} to go${formattedTimeLeft}${exclamationMark}`;
		}
	}
};
</script>

<style scoped>
.progress-group-amount-low {
	color: #FF5C00;
}
</style>
