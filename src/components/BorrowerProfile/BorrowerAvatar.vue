<template>
	<picture class="tw-rounded-full tw-overflow-hidden tw-bg-brand">
		<source
			v-for="({ media, urls }, index) in sources"
			:key="index"
			:media="`(${media})`"
			:srcset="buildSrcSet(urls)"
		>
		<img :src="fallback" :alt="alt">
	</picture>
</template>

<script>
export default {
	props: {
		/**
		 * String to use as the alternative of this image for screen readers
		* */
		alt: {
			type: String,
			required: true,
		},
		/**
		 * String url to use as the fallback image if <picture> is not supported
		* */
		fallback: {
			type: String,
			required: true,
		},
		/**
		 * Array of objects for different image sources.
		 * Sample object:
		 * 		{
		 			media: 'min-width: 1025px',
					urls: {
						'2x': 'http://example.com/image@2x.jpg',
						'1x': 'http://example.com/image.jpg',
					},
				}
		* */
		sources: {
			type: Array,
			required: true,
		},
	},
	methods: {
		buildSrcSet(urls) {
			return Object.keys(urls)
				.map(key => `${urls[key]} ${key}`)
				.join(', ');
		},
	},
};
</script>
