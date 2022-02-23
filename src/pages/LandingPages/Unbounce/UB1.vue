<template>
	<www-page class="">
		<div id="frameHolder" ref="frameHolderRef">
			<iframe
				v-if="iFrameUrl"
				class="tw-mx-auto"
				id="embedFrame"
				:src="iFrameUrl"
				:width="frameWidth"
				:height="frameHeight"
				frameborder="0"
			></iframe>
			<!-- TODO: Add loading-overlay to mask iframe loading and resizing -->
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage,
	},
	metaInfo: {
		title: 'Landing Page'
	},
	data() {
		return {
			frameWidth: 0,
			frameHeight: 0,
			iFrameUrl: 'https://us.kiva.org/stover-test-page-embed/',
			showFrame: true,
		};
	},
	methods: {
		handleIFrameMessage(message) {
			// TODO: Consider https://github.com/davidjbradshaw/iframe-resizer for managing iframe resizing
			const messageDataType = message?.data?.type;
			// Events emitted via 'postMessage'
			if (messageDataType && messageDataType === 'ub_frame_data') {
				console.log('ub_frame_data: ', message?.data);
				// update frame dimensions
				this.frameHeight = message?.data?.frameHeight ?? 800;
				this.frameWidth = message?.data?.frameWidth ?? 800;
				this.showFrame = true;
			}
		},
	},
	mounted() {
		if (!this.$isServer) {
			// TOOD: Extract and call on window resize, potentially cap width and set margin to auto
			this.frameWidth = this.$refs?.frameHolderRef?.clientWidth ?? 1072;

			window.addEventListener('message', message => {
				this.handleIFrameMessage(message);
			});
		}
	},
};
</script>

<style scoped>
#frame-holder {
	display: block;
	width: 100vw;
	height: 100vh;
	overflow: visible;
}
</style>
