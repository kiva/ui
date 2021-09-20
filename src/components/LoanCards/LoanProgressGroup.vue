<template>
	<figure>
		<h4 class="tw-mb-0.5">
			{{ moneyLeft | numeral('$0,0[.]00') }} to go{{ timeLeft !== '' ? '. ' + timeLeft : '' }}
		</h4>
		<kv-progress-bar
			class="tw-mb-1.5 lg:tw-mb-1"
			aria-label="Percent the loan has funded"
			:value="progressPercent * 100"
		/>
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
