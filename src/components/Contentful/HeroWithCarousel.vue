<template>
	<section-with-background :background-content="heroBackground">
		<template #content>
			<kv-page-container>
				<kv-grid class="tw-grid-cols-12">
					<div class="tw-col-span-12 md:tw-col-start-2 md:tw-col-span-10 lg:tw-col-span-6">
						<h1 v-html="heroHeadline">
						</h1>
						<h3 v-html="heroSubHeadline" class="tw-pt-2.5 lg:tw-pt-2">
						</h3>
					</div>
					<div class="tw-col-span-12">
						<kv-carousel
							:embla-options="{ loop: false }"
							:multiple-slides-visible="true"
							slides-to-scroll="visible"
							class="tw-w-full"
							slide-max-width="32.5rem"
						>
							<template v-for="(storyCard, index) in storyCards" #[`storyCard${index}`]>
								<story-card :content="storyCard" :key="index" />
							</template>
						</kv-carousel>
					</div>
				</kv-grid>
			</kv-page-container>
		</template>
	</section-with-background>
</template>

<script>
import SectionWithBackground from '@/components/Contentful/SectionWithBackground';
import StoryCard from '@/components/Contentful/StoryCard';

import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';

/**
* Hero With Carousel Component
* This component will display a Hero driven by a Contentful Content
* Group of type heroWithCarousel. Content will be displayed above a
* full width carousel. Hero should have cards as Content Items
* */

export default {
	components: {
		KvCarousel,
		KvGrid,
		KvPageContainer,
		SectionWithBackground,
		StoryCard
	},
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
		heroText() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'genericContentBlock' : false;
			});
		},
		heroHeadline() {
			return this.heroText?.headline ?? '';
		},
		heroSubHeadline() {
			return this.heroText?.subHeadline ?? '';
		},
		heroBackground() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
		storyCards() {
			return this.content?.contents?.filter(({ contentType }) => {
				return contentType ? contentType === 'storyCard' : false;
			});
		},
	}
};
</script>

<style lang="scss" scoped>
</style>
