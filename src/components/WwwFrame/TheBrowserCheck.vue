<template>
	<kv-alert
		v-if="isUnsupportedBrowser"
		variant="caution"
	>
		<div class="tw-text-center strong">
			Your browser is unsupported.
			Please use
			<template v-if="isAppleDevice">
				Safari,
			</template>
			<a href="https://www.mozilla.org/en-US/firefox/download/thanks/" target="_blank">Firefox</a>,
			<a href="https://www.google.com/chrome/" target="_blank">Chrome</a>,
			or <a href="https://www.microsoft.com/en-us/edge" target="_blank">Microsoft Edge</a>.
		</div>
	</kv-alert>
</template>

<script>
import KvAlert from '@/components/Kv/KvAlert';

export default {
	inject: ['device'],
	components: {
		KvAlert,
	},
	computed: {
		isUnsupportedBrowser() {
			return this.device?.browser?.name === 'Internet Explorer';
		},
		isAppleDevice() {
			return this.device?.platform?.vendor === 'Apple';
		}
	}
};
</script>
