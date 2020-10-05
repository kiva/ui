<template>
	<div class="email-preview-section-wrapper row" id="email-preview">
		<div class="small-12 large-6 columns">
			<kv-responsive-image
				class="img"
				:images="images"
				alt="A Monthly Good email in your inbox"
			/>
		</div>
		<div class="small-12 large-6 columns">
			<div class="email-preview-text">
				<h2 class="impact-text">
					Monthly Good, delivered to your inbox
				</h2>
				<p>
					<!-- eslint-disable-next-line max-len -->
					Once a month, we'll send you a dose of inspiration with an update on who your funds supported and how you’re making a difference.
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

const emailPreviewImageRequire = require.context('@/assets/images/mg-email-preview', true);

export default {
	components: {
		KvResponsiveImage,
	},
	data() {
		return {
			images: [
				['small', emailPreviewImageRequire('./email-preview-mobile-std.jpg')],
				['small retina', emailPreviewImageRequire('./email-preview-mobile-retina.jpg')],
				['xga', emailPreviewImageRequire('./email-preview-desktop-std.jpg')],
				['xga retina', emailPreviewImageRequire('./email-preview-desktop-retina.jpg')],
			]
		};
	},

};
</script>

<style lang="scss" scoped>
@import 'settings';

h2 {
	color: $kiva-green;
	margin-bottom: 1.85rem;
}

.email-preview-text {
	padding: 4rem 1rem;
}

.img {
	max-width: 21.88rem;
	margin: 0 auto;
	display: block;
}
</style>
