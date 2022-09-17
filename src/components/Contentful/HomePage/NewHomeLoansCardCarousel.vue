<template>
	<div>
		<kiva-category-carousel
			:contentful-loan-channels="contentfulLoanChannels"
			:loan-display-settings="loanDisplaySettings"
			:new-home-exp="true"
		/>
	</div>
</template>

<script>
import KivaCategoryCarousel from '@/components/Homepage/HomeExp/KivaCategoryCarousel';
import contentfulStylesMixin from '@/plugins/contentful-ui-setting-styles-mixin';

export default {
	name: 'NewHomeLoansCardCarousel',
	components: {
		KivaCategoryCarousel,
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
		/**
		 * Extract Background content from Contentful
		* */
		background() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
		/**
		 * Extract Loan Channel settings from Contentful Ui Setting dataObject
		* */
		contentfulLoanChannels() {
			const uiSetting = this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'uiSetting' : false;
			});
			return uiSetting?.dataObject?.loanChannels ?? [];
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
