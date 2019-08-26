<template>
	<img :src="imageUrl" v-bind="$attrs">
</template>

<script>
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import { isHighDensity, isRetina } from '@/util/checkScreenDensity';
import screenSizeMixin from '@/plugins/screen-size-mixin';

export default {
	mixins: [screenSizeMixin],
	props: {
		// An array of image sizes and urls, e.g. [['small', 'img-sm.jpg'], ['small retina', 'img-sm-retina.jpg']]
		images: { type: Array, required: true }
	},
	data() {
		return {
			isRetina: false,
		};
	},
	computed: {
		// An array of all images with 'retina' in the size name
		retinaImages() {
			return _filter(this.images, image => image[0].indexOf('retina') > -1);
		},
		// An array of all images without 'retina' in the size name
		standardImages() {
			return _filter(this.images, image => image[0].indexOf('retina') === -1);
		},
		// The non-retina image that best fits the current screen size
		bestStandardImage() {
			// screenBreakpoints comes from screenSizeMixin, sorted largest to smallest.
			// So we can iterate that array to find the largest image we have available to display
			for (let i = 0; i < this.screenBreakpoints.length; i += 1) {
				const size = this.screenBreakpoints[i];
				const image = _find(this.standardImages, im => im[0].indexOf(size) > -1);
				if (image) return image;
			}
			return ['', ''];
		},
		imageUrl() {
			// check if we have a retina version of the image
			if (this.isRetina) {
				const size = this.bestStandardImage[0];
				const retinaImage = _find(this.retinaImages, r => r[0].indexOf(size) > -1);
				if (retinaImage) return retinaImage[1];
			}
			// otherwise return the url of the standard image
			return this.bestStandardImage[1];
		},
	},
	mounted() {
		// Check for retina/high denisty display
		this.isRetina = isRetina() || isHighDensity();
	},
};
</script>

<style lang="scss">
</style>
