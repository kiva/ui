<template>
	<div class="email-preview-section-wrapper row">
		<div class="small-12 large-6 columns">
			<!-- responsive image based on BS breakpoints -->
			<!-- Values are set based on 'small-12 large-6' values above -->
			<!-- TODO use KvResponsiveImage2 or create new component -->
			<picture v-for="(media, index) in contentGroup.media" :key="index">
				<source media="(min-width: 681px)" :srcset="media.fields.file.url + '?w=495&fm=webp&q=80'">
				<source media="(min-width: 400px)" :srcset="media.fields.file.url + '?w=400&fm=webp&q=80'">
				<img :src="media.fields.file.url" :alt="media.fields.description">
			</picture>
		</div>
		<div class="small-12 large-6 columns">
			<div class="email-preview-text">
				<h2 class="impact-text">
					{{ contentGroup.content.fields.headline }}
				</h2>
				<div v-html="bodyCopy"></div>
			</div>
		</div>
	</div>
</template>

<script>
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

// const emailPreviewImageRequire = require.context('@/assets/images/mg-email-preview', true);

export default {
	props: {
		contentGroup: {
			type: Object,
			default() {
				return {};
			}
		},
	},
	computed: {
		bodyCopy() {
			return documentToHtmlString(this.contentGroup.content.fields.bodyCopy);
		}
	},
	// data() {
	// 	return {
	// 		images: [
	// 			['small', emailPreviewImageRequire('./email-preview-mobile-std.jpg')],
	// 			['small retina', emailPreviewImageRequire('./email-preview-mobile-retina.jpg')],
	// 			['xga', emailPreviewImageRequire('./email-preview-desktop-std.jpg')],
	// 			['xga retina', emailPreviewImageRequire('./email-preview-desktop-retina.jpg')],
	// 		]
	// 	};
	// },
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

img {
	max-width: 100%;
	height: auto;
	margin: 0 auto;
	display: block;
}
</style>
