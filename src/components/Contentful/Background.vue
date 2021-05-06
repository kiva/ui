<template>
	<div class="background__wrapper" :style="backgroundStyle">
		<video class="background__media" v-if="isBackgroundVideo"
			:src="backgroundMedia.url"
			autoplay
			loop
			muted
			playsinline
		></video>
		<kv-contentful-img class="background__media"
			v-if="isBackgroundImage"
			:width="1440"
			:contentful-src="backgroundMedia.url"
			fallback-format="jpg"
			:alt="backgroundMedia.description"
			:source-sizes="sourceSizes"
		/>
	</div>
</template>

<script>
import KvContentfulImg from '@/components/Kv/KvContentfulImg';

/**
* Dynamic Background Element from a 'Background' type Contentful content
* */

export default {
	data() {
		return {
			sourceSizes: [
				{
					width: 1920,
					height: 650,
					media: 'min-width: 1441px',
				},
				{
					width: 1440,
					height: 620,
					media: 'min-width: 1025px',
				},
				{
					width: 1024,
					height: 441,
					media: 'min-width: 681px',
				},
				{
					width: 680,
					height: 372,
					media: 'min-width: 481px',
				},
				{
					width: 480,
					height: 540,
					media: 'min-width: 0px',
				},
			],
		};
	},
	components: {
		KvContentfulImg,
	},
	props: {
		/**
		 * Content group content for background from Contentful type Background
		* */
		backgroundContent: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		backgroundStyle() {
			if (this.backgroundContent?.backgroundColor) {
				return {
					'background-color': this.backgroundContent?.backgroundColor
				};
			}
			return {};
		},
		isBackgroundVideo() {
			return this.backgroundContent?.backgroundMedia?.file?.contentType.includes('video');
		},
		isBackgroundImage() {
			return this.backgroundContent?.backgroundMedia?.file?.contentType.includes('image');
		},
		backgroundMedia() {
			return {
				description: this.backgroundContent?.backgroundMedia?.description ?? '',
				title: this.backgroundContent?.backgroundMedia?.title ?? '',
				url: this.backgroundContent?.backgroundMedia?.file?.url ?? ''
			};
		},
	},
};
</script>

<style lang="scss" scoped>
.background {
	&__wrapper {
		width: 100%;
		height: 100%;
	}

	&__media {
		object-fit: cover;
		width: 100%;
		height: 100%;

		// over ride kvContentfulImg nexted img styling
		::v-deep img {
			object-fit: cover;
			width: 100%;
			height: 100%;
		}
	}
}
</style>
