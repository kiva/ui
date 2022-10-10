<template>
	<section-with-background-classic
		:background-content="background"
		:theme-name="themeName"
		:vertical-padding="verticalPadding"
	>
		<template #content>
			<kv-page-container>
				<kv-frequently-asked-questions
					:headline="frequentlyAskedQuestionsHeadline"
					:questions="frequentlyAskedQuestions"
				/>
			</kv-page-container>
		</template>
	</section-with-background-classic>
</template>

<script>
import contentfulStylesMixin from '@/plugins/contentful-ui-setting-styles-mixin';
import SectionWithBackgroundClassic from '@/components/Contentful/SectionWithBackgroundClassic';
import KvFrequentlyAskedQuestions from '@/components/Kv/KvFrequentlyAskedQuestions';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	name: 'FrequentlyAskedQuestions',
	components: {
		KvFrequentlyAskedQuestions,
		KvPageContainer,
		SectionWithBackgroundClassic,
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
		frequentlyAskedQuestionsHeadline() {
			return this.content?.title ?? null;
		},
		frequentlyAskedQuestions() {
			return this.content?.contents ?? null;
		},
		background() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
	},
};
</script>
