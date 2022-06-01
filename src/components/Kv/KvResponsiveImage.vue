<template>
	<picture>
		<!-- browser uses the first <source> tag matching media query even if later <source> tags also match -->
		<!-- So start with the largest window sizes first -->
		<source
			v-for="image in standardImages"
			:key="`${image[0]}-${image[1]}`"
			:media="`(min-width: ${getPxSizeForImage(image[0])}px)`"
			:srcset="getSrcsetForImage(image)"
		>
		<img
			:src="standardImages[0][1]"
			v-bind="$attrs"
			ref="img"
		>
	</picture>
</template>

<script>
import _throttle from 'lodash/throttle';
import { isHighDensity, isRetina } from '@/util/checkScreenDensity';

// Responsive Image Reading:
// https://developers.google.com/web/fundamentals/design-and-ux/responsive/images
// https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
// https://dev.to/stefanoverna/how-to-offer-responsive-progressive-images-in-2020-in-one-line-5fed

export default {
	name: 'KvResponsiveImage',
	inheritAttrs: false,
	props: {
		/**
		 * A two-dimensional array containing image sizes and urls, ordered smallest to largest, e.g.,
		 * [
		 *   ['small', 'img-sm.jpg'],
		 *   ['small retina', 'img-sm-2x.jpg']],
		 *   ['medium', 'img-md.jpg'],
		 *   ['medium retina', 'img-md-2x.jpg']],
		 * ]
		* */
		images: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			isRetina: null,
			screenWidth: 320,
			breakpoints: [
				{ name: 'wxga', size: 1441 },
				{ name: 'xga', size: 1025 },
				{ name: 'xxlarge', size: 989 },
				{ name: 'xlarge', size: 761 },
				{ name: 'large', size: 681 },
				{ name: 'medium', size: 481 },
				{ name: 'small', size: 0 },
			]
		};
	},
	computed: {
		// An array of current breakpoint names, largest to smallest (e.g. ['large', 'medium', 'small'])
		screenBreakpoints() {
			return this.breakpoints.filter(breakpoint => breakpoint.size <= this.screenWidth)
				.map(breakpoint => breakpoint.name);
		},
		// An array of all images with 'retina' in the size name
		retinaImages() {
			return this.images.filter(image => image[0].indexOf('retina') > -1).reverse();
		},
		// An array of all images without 'retina' in the size name
		standardImages() {
			return this.images.filter(image => image[0].indexOf('retina') === -1).reverse();
		},
		// The non-retina image that best fits the current screen size
		bestStandardImage() {
			// screenBreakpoints is sorted largest to smallest.
			// So we can iterate that array to find the largest image we have available to display
			for (let i = 0; i < this.screenBreakpoints.length; i += 1) {
				const size = this.screenBreakpoints[i];
				const image = this.standardImages.find(im => im[0].indexOf(size) > -1);
				if (image) return image;
			}
			return ['', ''];
		},
		imageUrl() {
			// check if we have a retina version of the image
			if (this.isRetina) {
				const size = this.bestStandardImage[0];
				const retinaImage = this.retinaImages.find(r => r[0].indexOf(size) > -1);
				if (retinaImage) return retinaImage[1];
			}
			// otherwise return the url of the standard image
			return this.bestStandardImage[1];
		},
	},
	methods: {
		getPxSizeForImage(image) {
			return this.breakpoints.find(breakpoint => breakpoint.name === image).size;
		},
		getSrcsetForImage(image) {
			const retina = this.retinaImages.find(retinaImage => retinaImage[0] === `${image[0]} retina`);
			if (retina) {
				return `${image[1]}, ${retina[1]} 2x`;
			}
			return `${image[1]}`;
		}
	},
	mounted() {
		// Check for retina/high density display
		this.isRetina = isRetina() || isHighDensity();

		if (typeof window.HTMLPictureElement === 'undefined') {
			// Set initial screen size
			this.screenWidth = window.innerWidth;

			this.$refs.img.src = this.imageUrl;
			// Update the screen size at most every 200ms when the window is being resized
			window.addEventListener('resize', _throttle(() => {
				this.screenWidth = window.innerWidth;
				this.$refs.img.src = this.imageUrl;
			}, 200));
		}
	},
};
</script>
<style lang="scss" scoped>
	picture,
	img {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
