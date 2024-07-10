<template>
	<www-page>
		<div class="tw-bg-primary">
			<div
				v-if="!loadFrame"
				class="tw-text-center tw-my-4"
			>
				<kv-loading-spinner />
			</div>

			<div id="frameHolder" ref="frameHolderRef">
				<iframe
					v-if="loadFrame"
					class="tw-mx-auto"
					id="embedFrame"
					:src="iFrameUrl"
					:width="frameWidth"
					:height="frameHeight"
					frameborder="0"
				></iframe>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import oneTrustGlobalEvent from '@/head/oneTrustEvent';
import _throttle from 'lodash/throttle';

export default {
	name: 'IFrameEmbed',
	components: {
		KvLoadingSpinner,
		WwwPage,
	},
	props: {
		unbouncePath: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			frameWidth: 0,
			frameHeight: 0,
			loadFrame: false,
			queryParams: '',
		};
	},
	computed: {
		iFrameUrl() {
			return `https://go.kiva.org/${this.unbouncePath}${this.queryParams}`;
		}
	},
	methods: {
		// This is called on load and resize from the iframe source
		handleIFrameMessage(message) {
			// TODO: Consider https://github.com/davidjbradshaw/iframe-resizer for managing iframe resizing
			const messageDataType = message?.data?.type;
			// Events emitted via 'postMessage'
			if (messageDataType && messageDataType === 'ub_frame_data') {
				console.log('ub_frame_data: ', message?.data);
				// update frame dimensions
				this.frameHeight = message?.data?.frameHeight ?? 800;
			}
		},
		/** Event should be a custom event with detail param
		 * containing groups key as a string of accepted groups. */
		handleOneTrustAccepted(event) {
			// check for opt out of 3rd party scripts + cookies
			const cookies = typeof document !== 'undefined' ? document.cookie.split(';') : [];
			let optout = false;
			for (let i = 0; i < cookies.length; i++) { // eslint-disable-line
				if (cookies[i].indexOf('kvgdpr') > -1 && cookies[i].indexOf('opted_out=true') > -1) {
					optout = true;
				}
			}
			// event?.detail?.groups should be a string like: 'C0001:1,C0003:1,C0002:1,C0004:1'
			const groups = event?.detail?.groups;
			this.queryParams = `?groups=${encodeURIComponent(groups)}&optout=${optout}`;
			this.loadFrame = true;
		},
		resizeIframe() {
			this.frameWidth = this.$refs?.frameHolderRef?.clientWidth ?? 1072;
		}
	},
	mounted() {
		if (!this.$isServer) {
			this.resizeIframe();

			window.addEventListener('message', message => {
				this.handleIFrameMessage(message);
			});

			/** This event is fired either when this component mounts
			* or from scripts.js when the cookie policy is changed */
			window.addEventListener('oneTrustAccepted', this.handleOneTrustAccepted);

			window.addEventListener('resize', _throttle(() => {
				this.resizeIframe();
			}, 200));

			oneTrustGlobalEvent();
		}
	},
	beforeDestroy() {
		window.removeEventListener('oneTrustAccepted', this.handleOneTrustAccepted);

		window.removeEventListener('resize', _throttle(() => {
			this.resizeIframe();
		}, 200));
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
