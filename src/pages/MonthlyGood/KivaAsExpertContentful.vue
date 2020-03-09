<template>
	<div class="kiva-as-expert-section-wrapper">
		<div class="row">
			<div class="small-12 columns">
				<h2 class="impact-text">
					{{ contentGroup.content.fields.headline }}
				</h2>
			</div>
			<div class="small-12 large-7 columns">
				<div v-html="bodyCopy"></div>
				<slot name="form"></slot>
			</div>

			<div class="large-5 columns">
				<!-- responsive image based on BS breakpoints -->
				<!-- Values are set based on 'small-12 large-6' values above -->
				<!-- TODO use KvResponsiveImage2 or create new component -->
				<picture v-for="(media, index) in contentGroup.media" :key="index">
					<source media="(min-width: 681px)" :srcset="media.fields.file.url + '?w=495&fm=webp&q=80'">
					<source media="(min-width: 400px)" :srcset="media.fields.file.url + '?w=400&fm=webp&q=80'">
					<img :src="media.fields.file.url" :alt="media.fields.description">
				</picture>
			</div>
		</div>
	</div>
</template>

<script>
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

// const billionImpactImagesRequire = require.context('@/assets/images/10-years-billion-impact', true);

export default {
	props: {
		contentGroup: {
			type: Object,
			default() {
				return {};
			}
		},
	},
	// data() {
	// 	return {
	// 		billionImpactImages: [
	// 			['small', billionImpactImagesRequire('./10-years-billion-impact_ghost.jpg')],
	// 			['small retina', billionImpactImagesRequire('./10-years-billion-impact_2x_ghost.jpg')],
	// 		]
	// 	};
	// },
	computed: {
		bodyCopy() {
			return documentToHtmlString(this.contentGroup.content.fields.bodyCopy);
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.kiva-as-expert-section-wrapper {
	padding: 2rem 0 3rem;
	background-color: $ghost;

	h2 {
		color: $kiva-green;
		margin-bottom: 1.85rem;
	}

	.community-image {
		padding: 1.25rem;
		width: 100%;
	}

	.hide-for-large.community-image {
		max-width: 25rem;
		display: block;
		margin: 0 auto;
	}

	.join-the-movement {
		padding: 1.85rem 0;
	}
}
</style>
