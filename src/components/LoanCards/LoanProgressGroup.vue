<template>
	<figure>
		<h4 class="tw-mb-0.5">
			{{ fundingText }}
		</h4>
		<fundraising-status-meter
			v-if="useNewProgress"
			:is-funded="progressPercent === 100"
			:percent-raised="progressPercent"
		/>
		<kv-progress-bar
			v-else
			class="tw-mb-1.5 lg:tw-mb-1"
			aria-label="Percent the loan has funded"
			:value="progressPercent * 100"
		/>
	</figure>
</template>

<script>
import numeral from 'numeral';
import FundraisingStatusMeter from '@/components/LoanCards/FundraisingStatus/FundraisingStatusMeter';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';

export default {
	name: 'LoanProgressGroup',
	components: {
		KvProgressBar,
		FundraisingStatusMeter
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
		allSharesReserved: {
			type: Boolean,
			default: false,
		},
		useNewProgress: {
			type: Boolean,
			default: false,
		}
	},
	computed: {
		fundingText() {
			const formattedMoneyLeft = numeral(this.moneyLeft).format('$0,0[.]00');
			const formattedTimeLeft = `${this.timeLeft !== '' ? `. ${this.timeLeft}` : ''}`;

			const formatttedFundingText = `${formattedMoneyLeft} to go${formattedTimeLeft}`;
			return 	formatttedFundingText;
		}
	}
};
</script>
