<template>
	<div
		v-if="!!variation && timeLeftMs > 0"
		class="tw-text-small tw-font-medium tw-mt-0.5 tw-line-clamp-1"
		style="color: #CE4A00;"
	>
		{{ tagText }}
		<countdown-timer
			v-if="variation === 'ending-soon'"
			:time="timeLeftMs"
		/>
	</div>
</template>

<script>
import { differenceInDays, parseISO } from 'date-fns';
import CountdownTimer from '@/components/BorrowerProfile/CountdownTimer';

export default {
	name: 'LoanTagV2',
	components: {
		CountdownTimer
	},
	props: {
		loan: {
			type: Object,
			required: true,
		},
		amountLeft: {
			type: Number,
			required: true,
		},
	},
	mounted() {
		if (this.variation) {
			this.$kvTrackEvent(
				'loan-card',
				'show',
				`tag-${this.variation}`,
			);
		}
	},
	computed: {
		variation() {
			if (differenceInDays(parseISO(this.loan?.plannedExpirationDate), Date.now()) <= 3) {
				return 'ending-soon';
			} if (this.amountLeft < 100 && this.amountLeft >= 0) {
				return 'almost-funded';
			} if (this.loan?.matchingText) {
				return 'matched-loan';
			}
			return null;
		},
		tagText() {
			switch (this.variation) {
				case 'almost-funded': return 'Almost funded';
				case 'matched-loan': return `${this.matchRatio + 1}x matching by ${this.loan?.matchingText}`;
				default: return 'Ending soon: ';
			}
		},
		timeLeftMs() {
			const msLeft = parseISO(this.loan?.plannedExpirationDate).getTime() - new Date().getTime();
			return msLeft > 0 ? msLeft : 0;
		},
		matchRatio() {
			return this.loan?.matchRatio;
		}
	},
};
</script>
