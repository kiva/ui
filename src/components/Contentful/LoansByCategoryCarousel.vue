<template>
	<section-with-background-classic
		:background-content="background"
		:theme-name="themeName"
		:vertical-padding="verticalPadding"
	>
		<template #content>
			<kv-page-container>
				<div>
					<kiva-classic-multi-category-carousel
						:contentful-loan-categories="contentfulLoanCategories"
						:loan-display-settings="loanDisplaySettings"
					/>
				</div>
			</kv-page-container>
		</template>
	</section-with-background-classic>
</template>

<script>
import contentfulStylesMixin from '#src/plugins/contentful-ui-setting-styles-mixin';
import KivaClassicMultiCategoryCarousel from '#src/components/LoanCollections/KivaClassicMultiCategoryCarousel';
import SectionWithBackgroundClassic from '#src/components/Contentful/SectionWithBackgroundClassic';
import { KvPageContainer } from '@kiva/kv-components';

export default {
	name: 'LoansByCategoryCarousel',
	components: {
		KivaClassicMultiCategoryCarousel,
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
	data() {
		return {

		};
	},
	computed: {
		/**
		 * Extract Background content from Contentful
		* */
		background() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
		/**
		 * Extract Loan Category settings from Contentful Ui Setting dataObject
		* */
		contentfulLoanCategories() {
			const uiSetting = this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'uiSetting' : false;
			});
			return uiSetting?.dataObject?.loanCategories ?? [];
		},
		/**
		 * Extract Loan Display settings from Contentful Ui Setting dataObject
		* */
		loanDisplaySettings() {
			const uiSetting = this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'uiSetting' : false;
			});
			return {
				loanLimit: uiSetting?.dataObject?.loanLimit ?? 1,
				showViewMoreCard: uiSetting?.dataObject?.showViewMoreCard ?? false
			};
		}
	}
};
</script>
