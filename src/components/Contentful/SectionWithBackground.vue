<template>
	<section class="section-with-background">
		<div class="section-with-background__content-wrapper">
			<slot name="content">
			</slot>
		</div>
		<div class="section-with-background__background-wrapper" :style="backgroundStyle">
			<video
				class="section-with-background__media" v-if="isBackgroundVideo"
				:src="backgroundMedia.url"
				autoplay
				loop
				muted
				playsinline
			></video>
			<kv-contentful-img
				class="section-with-background__media"
				v-if="isBackgroundImage"
				:width="1440"
				:contentful-src="backgroundMedia.url"
				fallback-format="jpg"
				:alt="backgroundMedia.description"
				:source-sizes="sourceSizes"
			/>
		</div>
	</section>
</template>

<script>
import KvContentfulImg from '@/components/Kv/KvContentfulImg';

/**
* Section Background
* Creates a full width section with a full bleed background.
* */

export default {
	name: 'SectionWithBackground',
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
					media: 'min-width: 1024px',
				},
				{
					width: 680,
					height: 372,
					media: 'min-width: 734px',
				},
				{
					width: 480,
					height: 540,
					media: 'min-width: 0px',
				},
			],
		};
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
@import 'settings';

.section-with-background {
	padding: 0;
	position: relative;

	&__content-wrapper {
		padding: 2rem 0;

		@include breakpoint(large) {
			padding: 4rem 0 4rem;
		}

		width: 100%;
		overflow: hidden;
		z-index: 2;
		margin: 0;
		top: 0;
	}

	&__background-wrapper {
		width: 100%;
		height: 100%;
		z-index: -1;
		top: 0;
		position: absolute;
	}

	&__media {
		object-fit: cover;
		width: 100%;
		height: 100%;

		// over ride kvContentfulImg nested img styling
		::v-deep img {
			object-fit: cover;
			width: 100%;
			height: 100%;
		}
	}
}
</style>
