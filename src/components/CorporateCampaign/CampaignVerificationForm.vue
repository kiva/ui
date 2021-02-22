<template>
	<section class="campaign-verification section row align-center">
		<div class="small-12 large-8 align-self-middle columns">
			<kv-lightbox
				:visible="iFrameVisible"
				class="employee-verification"
				:prevent-close="true"
				id="faFormLightbox"
			>
				<iframe
					id="faForm"
					:src="iFrameSrc"
					:height="iFrameHeight"
					:width="iFrameWidth"
					frameborder="0"
				></iframe>
			</kv-lightbox>
		</div>
	</section>
</template>

<script>
import parseSPCookie from '@/util/parseSPCookie';
import cookieStore from '@/util/cookieStore';
import { addDays } from 'date-fns';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	metaInfo: {
		script: [
			{ src: '//kiva.tfaforms.net/js/iframe_resize_helper.js', async: true }
		],
	},
	components: {
		KvLightbox,
	},
	props: {
		formId: {
			type: String,
			default: null
		},
		maId: {
			type: String,
			default: ''
		},
		pfId: {
			type: String,
			default: ''
		},
		userId: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			iFrameSrc: null,
			iFrameVisible: false,
			iFrameWidth: 600,
			iFrameHeight: 800,
			spId: '',
			spUserId: '',
		};
	},
	mounted() {
		// initiate form if it has not been recently submitted
		if (!cookieStore.get('kvma-verified')) {
			this.initVerificationForm();
		}
	},
	methods: {
		initVerificationForm() {
			this.getSnowplowSession().then(() => {
				this.setFrameSrc();
				this.setIFrameDimensions();
				if (this.formId) {
					this.iFrameVisible = true;
				}
				window.addEventListener('message', message => {
					this.handleIFrameMessage(message);
				});
			});
		},
		setFrameSrc() {
			if (!this.$isServer && window && window.location && this.formId) {
				// eslint-disable-next-line max-len
				this.iFrameSrc = `https://kiva.tfaforms.net/${this.formId}?tfa_1=${this.userId}&tfa_2=${this.maId}&tfa_3=${this.pfId}&tfa_4=${this.spId}&tfa_5=${this.spUserId}`;
			}
		},
		setIFrameDimensions() {
			const maxFormWidth = 700;
			this.iFrameWidth = this.$el.clientWidth < maxFormWidth ? this.$el.clientWidth - 90 : maxFormWidth;
			this.iFrameHeight = this.$el.clientHeight > 300 ? this.$el.clientHeight : 500;
		},
		handleIFrameMessage(message) {
			const messageDataType = message?.data?.type;
			// Events emitted via 'postMessage'

			// 'fa_form_submitted' form submitted (may or may not be valid)
			if (messageDataType && messageDataType === 'fa_form_submitted') {
				// Update timestamp for submitted form
				this.formSubmittedTimestamp = Date.now();
			}

			// 'fa_form_closed' form completed and transitioned to thanks view
			if (messageDataType && messageDataType === 'fa_form_closed') {
				// compare the time closed with time submitted
				this.$nextTick(() => {
					const timeDifference = Date.now() - this.formSubmittedTimestamp;
					// set cookie and close lightbox if within recent 1 second threshold
					// > upon succesful submission the form is quickly unloaded
					if (timeDifference <= 1000) {
						// store cookie verification state for 24 hours
						cookieStore.set('kvma-verified', true, {
							expires: addDays(new Date(), 1)
						});
					}
					// handle closing lightbox
					window.setTimeout(
						() => {
							this.iFrameVisible = false;
							this.$emit('verification-complete');
						},
						1000
					);
				});
			}
		},
		async getSnowplowSession() {
			// get tracking data from snowplow cookie
			const { snowplowUserId, snowplowSessionId } = parseSPCookie();
			this.spId = snowplowSessionId;
			this.spUserId = snowplowUserId;
		}
	}
};
</script>

<style lang="scss" scoped>
::v-deep .kv-lightbox {
	.close-lightbox {
		display: none;
	}
}
</style>
