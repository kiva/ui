<template>
	<figure class="tw-grow">
		<div class="tw-flex tw-items-center tw-justify-between">
			<p>
				{{ daysLeft }} remaining
			</p>
			<p v-if="!minimalStats">
				{{ numeral(amountLeft).format('$0,0') }} to go
			</p>
		</div>
		<div class="tw-relative tw-mt-1">
			<kv-progress-bar
				class="progress-bar"
				label="Percent the campaign has funded"
				:value="progressPercentage"
				:bg-variant="bgVariant"
			/>
			<div
				class="tw-bg-white tw-rounded-full tw-absolute tw-right-0 tw-p-0.5 tw-shadow
					tw-w-4.5 tw-h-4.5 tw-flex tw-justify-center"
			>
				<heart-out-from-box class="tw-w-3" />
			</div>
		</div>
	</figure>
</template>

<script>
import numeral from 'numeral';
import HeartOutFromBox from '#src/assets/inline-svgs/challenge/heart-out-from-box.svg';
import { KvProgressBar } from '@kiva/kv-components';

export default {
	name: 'KvProgressCampaign',
	components: {
		KvProgressBar,
		HeartOutFromBox
	},
	props: {
		fundedAmount: {
			type: Number,
			default: 0,
			required: true,
		},
		totalAmount: {
			type: Number,
			default: 0,
			required: true,
		},
		daysLeft: {
			type: String,
			default: '',
		},
		minimalStats: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			bgVariant: 'tertiary',
			numeral,
		};
	},
	computed: {
		amountLeft() {
			return this.totalAmount - this.fundedAmount > 0
				? this.totalAmount - this.fundedAmount
				: 0;
		},
		progressPercentage() {
			return (this.fundedAmount / this.totalAmount) * 100;
		},
	},
};
</script>

<style lang="postcss" scoped>
div {
	@apply tw-flex tw-items-center tw-justify-between;
}

p {
	@apply tw-font-medium;
}

.progress-bar {
	height: 0.75rem !important;
	@apply tw-my-0.5;
}

.progress-bar :deep(div) {
	height: 0.75rem;
}
</style>
