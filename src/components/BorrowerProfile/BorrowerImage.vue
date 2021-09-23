<template>
	<picture
		class="
			tw-inline-block
			tw-relative
			tw-overflow-hidden
		"
		:style="`padding-bottom: ${aspectRatio * 100}%;`"
	>
		<source :srcset="srcset" :sizes="sizes">
		<img
			v-if="hash"
			class="
				tw-absolute
				tw-w-full
				tw-h-full
				tw-object-contain
			"
			:src="defaultUrl"
			:alt="alt"
			loading="lazy"
		>
		<summary-tag
			v-if="countryName"
			class="tw-absolute tw-bottom-2 tw-left-1"
			:city="city"
			:state="state"
			:country-name="countryName"
		>
			<kv-material-icon
				class="tw-h-2.5 tw-w-2.5 tw-mr-0.5"
				:icon="mdiMapMarker"
			/>
			{{ formattedLocation }}
		</summary-tag>
	</picture>
</template>

<script>
import { getKivaImageUrl } from '@/util/imageUtils';
import { mdiMapMarker } from '@mdi/js';

export default {
	props: {
		/**
		 * String to use as the alternative of this image for screen readers.
		 */
		alt: {
			type: String,
			required: true,
		},
		/**
		 * Number to use as the aspect ratio for this image. Defined as height / width.
		 */
		aspectRatio: {
			type: Number,
			default: 1,
		},
		/**
		 * Size properties of the default image to use as a fallback.
		 * Sample object:
		 * {
		 		width: 320,
				faceZoom: 50, // optional
			}
		 */
		defaultImage: {
			type: Object,
			required: true,
		},
		/**
		 * String of the hash of the image, used to build the image urls.
		 */
		hash: {
			type: String,
			required: true,
		},
		/**
		 * Array of image objects containing their size and their intended viewport display width.
		 * Sample image object:
		 * {
		 		width: 280, // width of the image at 1x
				viewSize: 320, // viewport width at which this size should be displayed
				faceZoom: 50, // optional
	 		}
		 */
		images: {
			type: Array,
			default: () => [],
		},
		city: {
			type: String,
			default: '',
		},
		state: {
			type: String,
			default: '',
		},
		countryName: {
			type: String,
			default: '',
		},
		distributionModel: {
			type: String,
			default: '',
		}
	},
	data() {
		return {
			mdiMapMarker,
		};
	},
	computed: {
		// Get the full url for the fallback image
		defaultUrl() {
			if (!this.hash) {
				return '';
			}
			return this.getImgUrl({
				...this.defaultImage,
				height: this.defaultImage.width * this.aspectRatio,
			});
		},
		// Get the 'sizes' string for the source element
		sizes() {
			if (!this.hash) {
				return '';
			}
			return this.images.map(({ width, viewSize }) => {
				if (viewSize) {
					return `(min-width: ${viewSize}px) ${width}px`;
				}
				return `${width}px`;
			}).join(', ');
		},
		// Get the 'srcset' string for the source element
		srcset() {
			if (!this.hash) {
				return '';
			}
			return this.images.map(({ width, faceZoom }) => {
				const height = width * this.aspectRatio;
				const size = {
					width,
					height,
					faceZoom
				};
				const retinaSize = {
					width: width * 2,
					height: height * 2,
					faceZoom,
				};
				return `${this.getSrcsetDef(size)}, ${this.getSrcsetDef(retinaSize)}`;
			}).join(', ');
		},
		formattedLocation() {
			if (this.distributionModel === 'direct') {
				const formattedString = `${this.city}, ${this.state}, ${this.countryName}`;
				return formattedString;
			}
			if (this.countryName === 'Puerto Rico') {
				const formattedString = `${this.city}, PR`;
				return formattedString;
			}
			return this.countryName;
		}
	},
	methods: {
		// Get the url for the loan image sized width by height
		getImgUrl(size) {
			return getKivaImageUrl({
				...size,
				base: this.$appConfig.photoPath,
				hash: this.hash,
			});
		},
		// Get a string to use in the srcset attribute as the definition for a single image size
		getSrcsetDef(size) {
			return `${this.getImgUrl(size)} ${size.width}w`;
		}
	},
};
</script>
