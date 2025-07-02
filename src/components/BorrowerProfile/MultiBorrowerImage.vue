<template>
	<div class="tw-flex tw-items-center">
		<div
			v-for="(img, idx) in images"
			:key="idx"
			class="tw-rounded-full tw-overflow-hidden tw-border-4 tw-border-white"
			:class="idx !== 0 ? 'tw--ml-6' : ''"
			:style="`width: ${imgWidth}px; height: ${imgWidth}px; z-index: ${10 + idx};`"
		>
			<picture
				class="tw-inline-block tw-relative tw-overflow-hidden"
				:style="`padding-bottom: 100%; width: ${imgWidth}px; height: ${imgWidth}px;`"
			>
				<source :srcset="getSrcset(img)" :sizes="getSizes(img)">
				<img
					v-if="img.hash"
					class="tw-absolute tw-w-full tw-h-full tw-object-contain"
					:src="getDefaultUrl(img)"
					:alt="img.alt"
					loading="lazy"
				>
			</picture>
		</div>
	</div>
</template>

<script>
import { getKivaImageUrl } from '#src/util/imageUtils';

export default {
	name: 'MultiBorrowerImage',
	props: {
		images: {
			type: Array,
			required: true,
		},
		aspectRatio: {
			type: Number,
			default: 1,
		},
		imgWidth: {
			type: Number,
			default: 70,
		},
	},
	methods: {
		getDefaultUrl(img) {
			if (!img.hash) return '';
			return getKivaImageUrl({
				...img.defaultImage,
				height: img.defaultImage.width * this.aspectRatio,
				base: this.$appConfig.photoPath,
				hash: img.hash,
			});
		},
		getSizes(img) {
			if (!img.hash) return '';
			return img.images.map(({ width, viewSize }) => {
				if (viewSize) {
					return `(min-width: ${viewSize}px) ${width}px`;
				}
				return `${width}px`;
			}).join(', ');
		},
		getSrcset(img) {
			if (!img.hash) return '';
			return img.images.map(({ width, faceZoom }) => {
				const height = width * this.aspectRatio;
				const size = { width, height, faceZoom };
				const retinaSize = { width: width * 2, height: height * 2, faceZoom };
				return (
					`${getKivaImageUrl({ ...size, base: this.$appConfig.photoPath, hash: img.hash })} ${width}w,`
					+ ` ${
						getKivaImageUrl({
							...retinaSize,
							base: this.$appConfig.photoPath,
							hash: img.hash
						})
					} ${width * 2}w`
				);
			}).join(', ');
		},
	},
};
</script>
