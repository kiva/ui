<template>
	<figure class="tw-grow">
		<div class="tw-flex tw-items-center tw-justify-between">
			<p>
				{{ fundedBorrowers }} funded
			</p>
			<p v-if="!minimalStats">
				{{ borrowersLeft }} to go
			</p>
		</div>
		<div class="tw-relative tw-mt-1">
			<kv-progress-bar
				class="tw-my-0.5"
				aria-label="Percent the loan has funded"
				:value="progressPercentage"
				:bg-variant="bgVariant"
			/>
			<div class="tw-bg-white tw-rounded-full tw-absolute tw-right-0 tw-p-0.5">
				<heart-out-from-box class="tw-w-3" />
			</div>
		</div>
	</figure>
</template>

<script>
import HeartOutFromBox from '@/assets/inline-svgs/challenge/heart-out-from-box.svg';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';

export default {
	name: 'KvProgressCampaign',
	components: {
		KvProgressBar,
		HeartOutFromBox
	},
	props: {
		fundedBorrowers: {
			type: Number,
			required: true,
		},
		totalBorrowers: {
			type: Number,
			required: true,
		},
		daysLeft: {
			type: Number,
			required: true,
		},
		minimalStats: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			bgVariant: 'tertiary',
		};
	},
	computed: {
		borrowersLeft() {
			return this.totalBorrowers - this.fundedBorrowers > 0
				? this.totalBorrowers - this.fundedBorrowers
				: 0;
		},
		progressPercentage() {
			return (this.fundedBorrowers / this.totalBorrowers) * 100;
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
