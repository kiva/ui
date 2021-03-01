<template>
	<picture
		class="kv-contentful-img"
		v-if="(width2x || height2x) && contentfulSrc && fallbackFormat"
	>
		<source
			type="image/webp"
			:srcset="`
					${getSrc(width2x, height2x)}&fm=webp 2x,
					${getSrc(width2x / 2, height2x / 2)}&fm=webp 1x`"
		>
		<img
			class="kv-contentful-img__img"
			:srcset="`
					${getSrc(width2x, height2x)}&fm=${fallbackFormat} 2x,
					${getSrc(width2x / 2, height2x / 2)}&fm=${fallbackFormat} 1x`"
			:src="`${getSrc(width2x / 2, height2x / 2)}&fm=${fallbackFormat}`"
			:width="width2x ? width2x / 2 : null"
			:height="height2x ? height2x / 2 : null"
			:alt="alt"
		>
	</picture>
</template>

<script>
export default {
	inheritAttrs: false,
	props: {
		contentfulSrc: {
			type: String,
			required: true
		},
		fallbackFormat: {
			type: String,
			required: true
		},
		width2x: {
			type: String,
			default: null
		},
		height2x: {
			type: String,
			default: null
		},
		alt: {
			type: String,
			default: '',
		}
	},
	methods: {
		getSrc(width, height) {
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
	.kv-contentful-img,
	.kv-contentful-img__img {
		display: block;
	}
</style>
