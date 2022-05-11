<template>
	<figure>
		<kv-progress-bar
			class="tw-mb-1.5 lg:tw-mb-1"
			aria-label="Percent the loan has funded"
			:value="progressPercent * 100"
		/>
		<figcaption class="tw-flex">
			<p class="tw-flex-auto" data-testid="bp-summary-timeleft">
				<countdown-timer
					v-if="urgency"
					:time="msLeft"
					class="tw-text-brand tw-text-h3"
				/>
				<span v-else class="tw-text-h3 tw-block tw-m-0">
					{{ timeLeft }}
				</span>

				<span class="tw-text-h4 tw-text-secondary tw-block">
					remaining
				</span>
			</p>
			<div class="tw-flex-auto tw-text-right">
				<p class="tw-text-h3 tw-m-0" data-testid="bp-summary-amount-to-go">
					{{ moneyLeft | numeral('$0,0[.]00') }} to go
				</p>
				<p class="tw-text-h4 tw-text-secondary" data-testid="bp-summary-percent-funded">
					{{ progressPercent | numeral('0%') }} funded
				</p>
			</div>
		</figcaption>
	</figure>
</template>

<script>
import CountdownTimer from '@/components/BorrowerProfile/CountdownTimer';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';

export default {
	components: {
		CountdownTimer,
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
		urgency: {
			type: Boolean,
			default: false,
		},
		msLeft: {
			type: Number,
			default: 0,
		},
	},
};
</script>
