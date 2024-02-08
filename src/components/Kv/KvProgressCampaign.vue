<template>
	<figure class="tw-grow">
		<div class="tw-flex tw-items-center tw-justify-between">
			<p>
				{{ fundedBorrowers }} funded
			</p>
			<p>
				{{ borrowersLeft }} to go
			</p>
		</div>
		<kv-progress-bar
			class="tw-my-1"
			aria-label="Percent the loan has funded"
			:value="progressPercentage"
			:bg-variant="bgVariant"
		/>
		<div>
			<p>
				{{ daysLeft }} days left
			</p>
		</div>
	</figure>
</template>

<script>
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';

export default {
	name: 'KvProgressCampaign',
	components: {
		KvProgressBar
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
