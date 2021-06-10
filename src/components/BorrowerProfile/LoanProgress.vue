<template>
	<figure>
		<kv-progress-bar
			class="tw-mb-1.5 lg:tw-mb-1"
			:value="progressPercent * 100"
		/>
		<figcaption class="tw-flex">
			<p class="tw-flex-auto">
				<span class="tw-text-h3 tw-block tw-m-0">
					{{ timeLeft }}
				</span>
				<span class="tw-text-h4 tw-text-gray-500 tw-block">
					remaining
				</span>
			</p>
			<div class="tw-flex-auto tw-text-right">
				<p class="tw-text-h3 tw-m-0">
					{{ moneyLeft | numeral('$0,0[.]00') }} to go
				</p>
				<p class="tw-text-h4 tw-text-gray-500">
					{{ progressPercent | numeral('0%') }} funded
				</p>
			</div>
		</figcaption>
	</figure>
</template>

<script>
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';

export default {
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
	},
};
</script>
