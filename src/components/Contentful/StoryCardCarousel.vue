<template>
	<section-with-background-classic
		:background-content="background"
		:theme-name="themeName"
		:vertical-padding="verticalPadding"
	>
		<template #content>
			<div
				class="tw-m-auto tw-pb-4 md:tw-pb-8 tw-bg-secondary tw-rounded"
				style="max-width: 36rem;"
			>
				<kv-carousel
					:embla-options="{ loop: false, align: 'center' }"
					:multiple-slides-visible="true"
					class="story-card-carousel tw-overflow-visible"
					slide-max-width="36rem"
				>
					<template v-for="(slide, index) in carouselSlides" #[`slide${index}`] :key="index">
						<story-card :content="slide" />
					</template>
				</kv-carousel>
			</div>
		</template>
	</section-with-background-classic>
</template>

<script>
import contentfulStylesMixin from '#src/plugins/contentful-ui-setting-styles-mixin';
import SectionWithBackgroundClassic from '#src/components/Contentful/SectionWithBackgroundClassic';
import StoryCard from '#src/components/Contentful/StoryCard';
import { KvCarousel } from '@kiva/kv-components';

export default {
	name: 'StoryCardCarousel',
	components: {
		KvCarousel,
		SectionWithBackgroundClassic,
		StoryCard,
	},
	mixins: [contentfulStylesMixin],
	props: {
		/**
		 * Content group content from Contentful
		* */
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		background() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
		carouselSlides() {
			return this.content.contents.filter(({ contentType }) => {
				return contentType ? contentType === 'storyCard' : false;
			});
		},
	},
};
</script>

<style lang="postcss" scoped>
/* Reposition the carousel controls */
.story-card-carousel:deep(.kv-carousel__controls) {
	@apply tw-m-auto tw-px-4 md:tw-px-5 tw-justify-center md:tw-justify-end;
}

/* Add rounded corners to story card images */
.story-card-carousel:deep(.dynamic-rich-text picture) {
	@apply tw-rounded tw-overflow-hidden;
}

/* Set font styles for body text */
.story-card-carousel:deep(.dynamic-rich-text) p {
	@apply tw-text-subhead;
}

.story-card-carousel:deep(.dynamic-rich-text) b {
	@apply tw-text-brand-900 tw-font-book;
}
</style>

<style lang="scss">
.story-card-carousel {
	.story-card {
		// Remove background set in StoryCard
		background: none;

		// Remove extra padding between bottom of story card and the carousel controls
		padding-bottom: 0;

		// Setup fading animation for slide transition
		.dynamic-rich-text > * {
			transition: opacity 500ms;
			opacity: 1;
		}
	}

	// When a slide is not active, hide every element that isn't an image in the DynamicRichText blocks in the slide
	[role=group][aria-current=false] {
		.story-card .dynamic-rich-text {
			& > * {
				opacity: 0;
			}

			& > figure,
			& > picture,
			& > img {
				opacity: 1;
			}
		}
	}
}
</style>
