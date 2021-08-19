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
				<kv-contentful-img class="tw-w-full tw-h-full tw-object-cover"
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
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';

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
			let classes = '';
			let hasSmSizes = false;
			let hasLgSizes = false;
			// Defaults currently applied around sections with backgrounds
			const defaultSmClasses = 'tw-pt-2 tw-pb-2';
			const defaultLgClasses = 'lg:tw-pt-4 lg:tw-pb-4';
			// establish padding object
			const vp = this.verticalPadding || {};

			// map size definitions to class strings
			const sizeClassStrings = Object.keys(vp).map(key => {
				// establish breakpoint size prefix
				const sizePrefix = key !== 'sm' ? `${key}:` : '';
				// extract size object
				const sizeObj = typeof vp[key] === 'object' ? vp[key] : {};
				// signify default overrides if present
				if (key === 'sm') hasSmSizes = true;
				if (key === 'lg') hasLgSizes = true;
				// process sizes
				const top = sizeObj.top.toString() ? `${sizePrefix}tw-pt-${sizeObj.top}` : '';
				const bottom = sizeObj.bottom.toString() ? `${sizePrefix}tw-pb-${sizeObj.bottom}` : '';
				// return our size based class set
				return `${top} ${bottom}`;
			});

			// Apply small defaults
			if (!hasSmSizes) {
				classes = `${defaultSmClasses}`;
			}
			// Apply large defualts if none are specified
			if (!hasLgSizes) {
				classes = `${defaultLgClasses}`;
			}

			classes = `${classes} ${sizeClassStrings.join(' ')}`;

			// return final class declarations
			return `${classes}`;
		}
	},
};
</script>
