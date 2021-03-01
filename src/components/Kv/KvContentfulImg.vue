<template>
	<picture
		class="kv-contentful-img"
		v-if="(width || height) && contentfulSrc && fallbackFormat"
	>
		<source
			type="image/webp"
			:srcset="`
					${buildUrl(width * 2, height * 2)}&fm=webp&q=70 2x,
					${buildUrl(width, height)}&fm=webp&q=80 1x`"
		>
		<img
			class="kv-contentful-img__img"
			:srcset="`
					${buildUrl(width * 2, height * 2)}&fm=${fallbackFormat}&q=70 2x,
					${buildUrl(width, height)}&fm=${fallbackFormat}&q=80 1x`"
			:src="`${buildUrl(width, height)}&fm=${fallbackFormat}&q=80`"
			:width="width ? width : null"
			:height="height ? height : null"
			:alt="alt"
			:loading="loading"
		>
	</picture>
</template>

<script>
// Since it's easy for marketing or other to upload massive images to contentful, in order to be performant
// respectful of our users data plans, and not damage our SEO, we shouldn't send the source image directly to our users.

// This component uses to contentful's image query params to:
// Serve webp with a fallback for older browsers. Offer both 1x and 2x images. Properly size the images.
// If we have both width and height we pass those attributes to the image to prevent jank.
// Allow lazy loading via image attribute.

export default {
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
		 * Loading hint to the browser - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading
		 * `lazy, eager`
		* */
		loading: {
			type: String,
			default: null
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
}
</style>
