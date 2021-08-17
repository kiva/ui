<template>
	<section class="">
		<div class="tw-relative tw-p-0">
			<div
				class="tw-relative tw-w-full tw-overflow-hidden tw-z-1 tw-m-0 tw-top-0"
				:class="verticalPaddingClasses"
			>
				<slot name="content">
				</slot>
			</div>
			<div
				class="tw-w-full tw-h-full tw-absolute tw-top-0 tw-z--1"
				:style="backgroundStyle"
			>
				<video class="tw-w-full tw-h-full tw-object-cover" v-if="isBackgroundVideo"
					:src="backgroundMedia.url"
					autoplay
					loop
					muted
					playsinline
				></video>
				<kv-contentful-img class="tw-w-full tw-h-full tw-object-cover section-with-background__media"
					v-if="isBackgroundImage"
					:width="1440"
					:contentful-src="backgroundMedia.url"
					fallback-format="jpg"
					:alt="backgroundMedia.description"
					:source-sizes="sourceSizes"
				/>
			</div>
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
		verticalPadding: {
			type: Object,
			default: () => {},
		}
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
		verticalPaddingClasses() {
			// Defaults
			const defaultSmClasses = 'tw-pt-2 tw-pb-2';
			const defaultLgClasses = 'lg:tw-pt-4 lg:tw-pb-4';
			let classes = '';

			// apply small or default classes
			if (this.verticalPadding && this.verticalPadding.sm) {
				// eslint-disable-next-line max-len
				classes = `${classes} tw-pt-${this.verticalPadding.sm.top} tw-pb-${this.verticalPadding.sm.bottom}`;
			} else {
				classes = `${defaultSmClasses}`;
			}

			// apply medium classes
			if (this.verticalPadding && this.verticalPadding.md) {
				// eslint-disable-next-line max-len
				classes = `${classes} md:tw-pt-${this.verticalPadding.md.top} md:tw-pb-${this.verticalPadding.md.bottom}`;
			}

			// apply large classes or default classes
			if (this.verticalPadding && this.verticalPadding.lg) {
				// eslint-disable-next-line max-len
				classes = `${classes} lg:tw-pt-${this.verticalPadding.lg.top} lg:tw-pb-${this.verticalPadding.lg.bottom}`;
			} else {
				classes = `${classes} ${defaultLgClasses}`;
			}

			// apply xl classes
			if (this.verticalPadding && this.verticalPadding.xl) {
				// eslint-disable-next-line max-len
				classes = `${classes} xl:tw-pt-${this.verticalPadding.xl.top} xl:tw-pb-${this.verticalPadding.xl.bottom}`;
			}

			// return final class declarations
			return `${classes}`;
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.section-with-background {
	&__media {
		// over ride kvContentfulImg nested img styling
		::v-deep img {
			object-fit: cover;
			width: 100%;
			height: 100%;
		}
	}
}
</style>
