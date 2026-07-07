<template>
	<div
		v-if="loading"
		class="tw-w-full tw-rounded tw-inline-block tw-relative tw-overflow-hidden"
		:style="`padding-bottom: ${aspectRatio * 100}%;`"
	>
		<kv-loading-placeholder class="!tw-absolute" />
	</div>
	<borrower-image
		v-else-if="!loading && figures.length === 1"
		class="tw-w-full tw-bg-black tw-rounded"
		data-testid="bp-story-borrower-image"
		:alt="name"
		:aspect-ratio="aspectRatio"
		:default-image="{ width: 612 }"
		:hash="figures[0].hash"
		:images="imagePreset"
	/>
	<kv-carousel
		v-else-if="!loading && figures.length > 1"
		:embla-options="{ loop: false }"
		class="loan-figure-carousel"
	>
		<template
			v-for="(figure, index) in figures"
			#[`slide${index}`]
			:key="figure.id ?? index"
		>
			<div
				v-if="figure.__typename === 'Video'"
				class="tw-relative tw-w-full tw-bg-black tw-rounded"
				:style="`padding-bottom: ${aspectRatio * 100}%;`"
			>
				<iframe
					class="tw-absolute tw-top-1/2 tw-left-0 tw-w-full tw-aspect-video tw--translate-y-1/2"
					data-testid="bp-story-borrower-video"
					:src="`https://www.youtube.com/embed/${figure.youtubeId}?rel=0`"
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
					allowfullscreen
				></iframe>
			</div>
			<borrower-image
				v-else
				class="tw-w-full tw-bg-black tw-rounded"
				data-testid="bp-story-borrower-image"
				:alt="name"
				:aspect-ratio="aspectRatio"
				:default-image="{ width: 612 }"
				:hash="figure.hash"
				:images="imagePreset"
			/>
		</template>
	</kv-carousel>
</template>

<script>
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import { KvCarousel, KvLoadingPlaceholder } from '@kiva/kv-components';

export default {
	name: 'LoanFigureCarousel',
	components: {
		BorrowerImage,
		KvCarousel,
		KvLoadingPlaceholder,
	},
	props: {
		figures: {
			type: Array,
			default: () => [],
		},
		name: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			aspectRatio: 16 / 25,
			imagePreset: [
				{ width: 612, viewSize: 1024 },
				{ width: 580, viewSize: 768 },
				{ width: 416, viewSize: 480 },
				{ width: 374, viewSize: 414 },
				{ width: 335, viewSize: 375 },
				{ width: 280 },
			],
		};
	},
	computed: {
		loading() {
			return !this.figures || this.figures.length === 0;
		},
	},
};
</script>
