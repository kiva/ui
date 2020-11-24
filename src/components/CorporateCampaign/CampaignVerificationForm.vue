<template>
	<section class="campaign-status section row align-center">
		<div class="small-12 large-8 align-self-middle columns">
			<div v-if="iFrameVisible">
				<iframe
					id="faForm"
					:src="iFrameSrc"
					:height="iFrameHeight"
					:width="iFrameWidth"
					frameborder="0"
				></iframe>
				<script type="application/javascript" src="//kiva.tfaforms.net/js/iframe_resize_helper.js"></script>
			</div>
		</div>
	</section>
</template>

<script>
export default {
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
			this.iFrameWidth = this.$el.clientWidth - 60;
			this.iFrameHeight = this.$el.clientHeight > 300 ? this.$el.clientHeight : 500;
		},
	}
};
</script>

<style lang="scss" scoped>

</style>
