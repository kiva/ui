<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
	<section-with-background-classic
		:background-content="background"
		:theme-name="themeName"
		:vertical-padding="verticalPadding"
	>
		<template
			#content class="tw-bg-primary"
		>
			<kv-page-container>
				<kv-grid
					class="tw-mx-auto tw-grid-cols-12"
				>
					<div
						v-for="(storyCard, index) in storyCards"
						:key="index"
						:class="[
							'tw-col-span-12',
							{
								'md:tw-col-span-6': storyCards.length >= 2,
								'lg:tw-col-span-6': storyCards.length === 2,
								'lg:tw-col-span-4': storyCards.length === 3,
								'lg:tw-col-span-3': storyCards.length === 4
							}
						]"
					>
						<story-card
							:content="storyCard"
							:key="index"
						/>
					</div>
				</kv-grid>
			</kv-page-container>
		</template>
	</section-with-background-classic>
</template>

<script>

import contentfulStylesMixin from '@/plugins/contentful-ui-setting-styles-mixin';
import SectionWithBackgroundClassic from '@/components/Contentful/SectionWithBackgroundClassic';
import StoryCard from '@/components/Contentful/StoryCard';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

/**
* Card Row Component
* This component is a layout wrapper for storyCards components driven by a Contentful Content
* Group of type cardRow.
*
* Contentful Content Group Configuration:
*	Unsupported Fields: Title, Media
*	Content Group - Contents Field Data:
*		- StoryCard: min: 1, max: 2
* 		- Background: optional
* 		- UI Settings: optional - only supports vertical padding.
* */

export default {
	name: 'CardRow',
	components: {
		KvGrid,
		KvPageContainer,
		SectionWithBackgroundClassic,
		StoryCard,
	},
	mixins: [contentfulStylesMixin],
	props: {
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
		storyCards() {
			const cardData = this.content?.contents?.filter(({ contentType }) => {
				return contentType === 'storyCard';
			});
			return cardData;
		},
	}
};
</script>
