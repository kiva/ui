<template>
	<div v-if="figures.length === 1" class="loan-figure-carousel">
		<iframe
			v-if="figures[0].__typename === 'Video'"
			class="tw-aspect-video tw-mx-auto tw-rounded tw-w-full"
			width="560"
			height="315"
			:src="`https://www.youtube.com/embed/${figures[0].youtubeId}?rel=0`"
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
			allowfullscreen
		></iframe>
		<borrower-image
			v-else
			class="tw-w-full tw-bg-black tw-rounded"
			data-testid="bp-story-borrower-image"
			:alt="name"
			:aspect-ratio="16 / 25"
			:default-image="{ width: 612 }"
			:hash="figures[0].hash"
			:images="imagePreset"
		/>
	</div>
	<kv-carousel
		v-else-if="figures.length > 1"
		:embla-options="{ loop: false }"
		class="loan-figure-carousel"
	>
		<template
			v-for="(figure, index) in figures"
			#[`slide${index}`]
			:key="figure.id ?? index"
		>
			<iframe
				v-if="figure.__typename === 'Video'"
				class="tw-aspect-video tw-mx-auto tw-rounded tw-w-full"
				width="560"
				height="315"
				:src="`https://www.youtube.com/embed/${figure.youtubeId}?rel=0`"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
				allowfullscreen
			></iframe>
			<borrower-image
				v-else
				class="tw-w-full tw-bg-black tw-rounded"
				data-testid="bp-story-borrower-image"
				:alt="name"
				:aspect-ratio="16 / 25"
				:default-image="{ width: 612 }"
				:hash="figure.hash"
				:images="imagePreset"
			/>
		</template>
	</kv-carousel>
</template>

<script>
import { KvCarousel } from '@kiva/kv-components';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';

export default {
	name: 'LoanFigureCarousel',
	components: {
		BorrowerImage,
		KvCarousel,
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
};
</script>
