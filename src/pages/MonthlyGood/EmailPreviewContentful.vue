<template>
	<div class="email-preview-section-wrapper row">
		<div class="small-12 large-6 columns">
			<!-- <picture>
				<source srcset="bootstrap-extra.jpg" media="(min-width: 1200px)" />
				<source srcset="bootstrap-large.jpg" media="(min-width: 992px)" />
				<source srcset="bootstrap-medium.jpg " media="(min-width: 768px)" />
				<source srcset="bootstrap-small.jpg" media="(min-width: 576px)" />
				<img src="bootstrap-extra-small.jpg" class="img-fluid" />
			</picture> -->
			<picture v-for="(media, index) in contentGroup.media" :key="index">
				<source media="(min-width: 800px)" :srcset="media.fields.file.url +'?w=800&h=600&fm=webp&q=80'">
				<source media="(min-width: 400px)" :srcset="media.fields.file.url + '?w=400&h=300&fm=webp&q=80'">
				<img :src="media.fields.file.url" :alt="media.fields.description" style="width: auto;">
			</picture>
		</div>
		<div class="small-12 large-6 columns">
			<div class="email-preview-text">
				<h2 class="impact-text">
					{{ contentGroup.content.fields.headline }}
				</h2>
				<div v-html="bodyCopy">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

const emailPreviewImageRequire = require.context('@/assets/images/mg-email-preview', true);

export default {
	props: {
		contentGroup: {
			type: Object,
			default() {
				return {};
			}
		},
	},
	components: {
		// KvResponsiveImage,
	},
	computed: {
		bodyCopy() {
			return documentToHtmlString(this.contentGroup.content.fields.bodyCopy);
		}
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

img {
	max-width: 21.88rem;
	margin: 0 auto;
	display: block;
}
</style>
