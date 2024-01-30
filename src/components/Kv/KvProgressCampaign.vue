<template>
	<figure>
		<div class="tw-flex tw-items-center tw-justify-between">
			<p>
				{{ fundedLoans }} loans funded
			</p>
			<p>
				{{ loansLeft }} to go!
			</p>
		</div>
		<kv-progress-bar
			class="tw-my-1"
			aria-label="Percent the loan has funded"
			:value="progressPercentage"
			:bg-variant="bgVariant"
		/>
		<div class="">
			<p>
				{{ numeralRaised }} raised
			</p>
			<p>
				{{ daysRemaining }}
			</p>
		</div>
	</figure>
</template>

<script>
import numeral from 'numeral';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';

export default {
	name: 'KvProgressCampaign',
	components: {
		KvProgressBar
	},
	props: {
		fundedLoans: {
			type: Number,
			required: true,
		},
		totalLoans: {
			type: Number,
			required: true,
		},
		daysLeft: {
			type: Number,
			required: true,
		},
		raisedMoney: {
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
		numeralRaised() {
			return numeral(this.raisedMoney).format('$0,0');
		},
		daysRemaining() {
			return `${this.daysLeft} days remaining`;
		},
		loansLeft() {
			return this.totalLoans - this.fundedLoans > 0
				? this.totalLoans - this.fundedLoans
				: 0;
		},
		progressPercentage() {
			return (this.fundedLoans / this.totalLoans) * 100;
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
