<template>
	<picture
		class="kv-contentful-img"
		v-if="(width || height) && contentfulSrc && fallbackFormat"
	>
		<!-- Set of image sources -->
		<template v-if="sourceSizes.length > 0">
			<template v-for="(image, index) in sourceSizes">
				<!-- browser supports webp -->
				<source
					:key="'webp-image'+index"
					:media="'('+image.media+')'"
					type="image/webp"
					:srcset="`
					${buildUrl(image.width * 2, image.height * 2)}${crop}&fm=webp&q=65 2x,
					${buildUrl(image.width, image.height)}${crop}&fm=webp&q=80 1x`"
				>
				<!-- browser doesn't support webp -->
				<source
					:key="'fallback-image'+index"
					:media="'('+image.media+')'"
					:srcset="`
					${buildUrl(image.width * 2, image.height * 2)}${crop}&fm=${fallbackFormat}&q=65 2x,
					${buildUrl(image.width, image.height)}${crop}&fm=${fallbackFormat}&q=80 1x`"
				>
			</template>
			<!-- browser doesn't support picture element -->
			<img
				class="kv-contentful-img__img"
				:src="`${buildUrl(width, height)}${crop}&fm=${fallbackFormat}&q=80`"
				:alt="alt"
				:loading="loading"
			>
		</template>

		<!-- Single image -->
		<template v-if="sourceSizes.length === 0">
			<!-- browser supports webp -->
			<source
				type="image/webp"
				:srcset="`
					${buildUrl(width * 2, height * 2)}&fm=webp&q=65 2x,
					${buildUrl(width, height)}&fm=webp&q=80 1x`"
			>
			<!-- browser doesn't support webp or browser doesn't support picture element -->
			<img
				class="kv-contentful-img__img"
				:srcset="`
					${buildUrl(width * 2, height * 2)}&fm=${fallbackFormat}&q=65 2x,
					${buildUrl(width, height)}&fm=${fallbackFormat}&q=80 1x`"
				:src="`${buildUrl(width, height)}&fm=${fallbackFormat}&q=80`"
				:width="width ? width : null"
				:height="height ? height : null"
				:alt="alt"
				:loading="loading"
			>
		</template>
	</picture>
</template>

<script>
// Since it's easy for marketing or other to upload massive images to contentful, in order to be performant
// respectful of our users data plans, and not damage our SEO, we shouldn't send the source image directly to our users.

// This component uses to contentful's image query params to:
// Serve webp with a fallback for older browsers.
// Offer both 1x and 2x images.
// Properly size the images and make sure they're compressed.
// If we have both width and height we pass those attributes to the image to prevent jank.
// Allow lazy loading via image attribute.

export default {
	name: 'KvContentfulImg',
	props: {
		/**
		 * Large, uncompressed image url that you get back from contentful.
		* */
		contentfulSrc: {
			type: String,
			required: true
		},
		/**
		 * If the browser can't support webp we fallback to this image format.
		 * `jpg, png`
		* */
		fallbackFormat: {
			type: String,
			required: true
		},
		/**
		 * 1x width of the image. Width or height must be defined. Ideally both.
		* */
		width: {
			type: [String, Number],
			default: null
		},
		/**
		 * 1x height of the image. Width or height must be defined. Ideally both.
		* */
		height: {
			type: [String, Number],
			default: null
		},
		/**
		 * alt text for the image
		* */
		alt: {
			type: String,
			default: '',
		},
		/**
		 * Additional contentful query param string for crop and fit
		* */
		crop: {
			type: String,
			default: '',
		},
		/**
		 * Loading hint to the browser - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading
		 * `lazy, eager`
		* */
		loading: {
			type: String,
			default: null,
			validator(value) {
				// The value must match one of these strings
				return ['lazy', 'eager'].indexOf(value) !== -1;
			}
		},
		/**
		 * Sources sizes.
		 * Array of objects for different image sources.
		 * Sample object:
		 * 		{
					width: 1440,
					height: 620,
					media: 'min-width: 1025px',
				}
		* */
		sourceSizes: {
			type: Array,
			required: false,
			default: () => []
		}
	},
	methods: {
		buildUrl(width, height) {
			let src = `${this.contentfulSrc}?`;
			if (width) {
				src += `w=${width}`;
			}
			if (width && height) {
				src += '&';
			}
			if (height) {
				src += `h=${height}`;
			}
			return src;
		}
	}
};
</script>
<style lang="scss" scoped>
.kv-contentful-img {
	display: inline-block;

	&__img {
		max-width: 100%;
		max-height: 100%;
	}
}
</style>
