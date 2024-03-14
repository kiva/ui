<template>
	<figure class="tw-grow">
		<div class="tw-flex tw-items-center tw-justify-between">
			<p>
				{{ daysLeft }} days remaining
			</p>
			<p v-if="!minimalStats">
				{{ numeral(amountLeft).format('$0,0') }} to go
			</p>
		</div>
		<div class="tw-relative tw-mt-1">
			<kv-progress-bar
				class="tw-my-0.5"
				aria-label="Percent the campaign has funded"
				:value="progressPercentage"
				:bg-variant="bgVariant"
			/>
			<div class="tw-bg-white tw-rounded-full tw-absolute tw-right-0 tw-p-0.5 tw-shadow">
				<heart-out-from-box class="tw-w-3" />
			</div>
		</div>
	</figure>
</template>

<script>
import numeral from 'numeral';
import HeartOutFromBox from '@/assets/inline-svgs/challenge/heart-out-from-box.svg';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';

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
			type: Number,
			default: 0,
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
		font-weight: 600;
		@apply tw-text-small;
	}
</style>
