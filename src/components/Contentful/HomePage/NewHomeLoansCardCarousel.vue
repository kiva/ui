<template>
	<section-with-background-classic
		:background-content="background"
		:theme-name="themeName"
		:vertical-padding="verticalPadding"
	>
		<template #content>
			<kv-page-container>
				<div>
					<kiva-loan-card-carousel
						:selected-channel="currentSelectedChannel"
						:loans="loanList"
					/>
				</div>
			</kv-page-container>
		</template>
	</section-with-background-classic>
</template>

<script>
import KivaLoanCardCarousel from '@/components/LoanCollections/HomeExp/KivaLoanCardCarousel';
import contentfulStylesMixin from '@/plugins/contentful-ui-setting-styles-mixin';
import SectionWithBackgroundClassic from '@/components/Contentful/SectionWithBackgroundClassic';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	name: 'NewHomeLoansCardCarousel',
	components: {
		KvPageContainer,
		SectionWithBackgroundClassic,
		KivaLoanCardCarousel
	},
	mixins: [contentfulStylesMixin],
	inject: ['apollo', 'cookieStore'],
	props: {
		/**
		 * Content group content from Contentful
		* */
		content: {
			type: Object,
			default: () => {},
		},
		loans: {
			type: Array,
			default: () => [],
		},
		selectedChannel: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			loanChannelData: [],
			currentSelectedChannel: {},
			loanList: [],
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
		 * Extract Loan Channel settings from Contentful Ui Setting dataObject
		* */
	},
	watch: {
		loans() {
			if (this.loans.length > 0 && this.selectedChannel.id) {
				this.loanList = this.selectedChannel.loans.values;
			}
		}
	},
};
</script>
