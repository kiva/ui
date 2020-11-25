<template>
	<section class="campaign-status section row align-center">
		<div class="small-12 large-8 align-self-middle columns">
			<kv-lightbox
				:visible="iFrameVisible"
				class="employee-verification"
				@lightbox-closed="close"
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
		userId: {
			type: String,
			default: null
		},
	},
	data() {
		return {
			iFrameSrc: null,
			iFrameVisible: false,
			iFrameWidth: 600,
			iFrameHeight: 800,
		};
	},
	mounted() {
		this.setFrameSrc();
		this.setIFrameDimensions();
		if (this.formId) {
			this.iFrameVisible = true;
		}
		window.addEventListener('message', message => {
			this.handleIFrameMessage(message);
		});
	},
	methods: {
		setFrameSrc() {
			if (!this.$isServer && window && window.location && this.formId) {
				const doneUrl = encodeURIComponent(
					`${window.location.origin}${this.$route.path}${window.location.search}&formComplete=true`
				);
				this.iFrameSrc = `https://kiva.tfaforms.net/${this.formId}?tfa_2=${this.userId}&tfa_3=${doneUrl}`;
			}
		},
		setIFrameDimensions() {
			this.iFrameWidth = this.$el.clientWidth - 90;
			this.iFrameHeight = this.$el.clientHeight > 300 ? this.$el.clientHeight : 500;
		},
		handleIFrameMessage(message) {
			const messageDataType = message?.data?.type;
			// Events emitted via 'postMessage'
			// 'form_submitted' form submitted (may or may not be valid)
			// 'frame_loaded' form window loaded (may or may not be on form or thanks view)
			// 'fa_form_closed' form completed and transitioned to thanks view
			if (messageDataType && messageDataType === 'fa_form_closed') {
				window.setTimeout(
					() => {
						this.iFrameVisible = false;
						this.$emit('verification-complete');
					},
					800
				);
			}
		},
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
