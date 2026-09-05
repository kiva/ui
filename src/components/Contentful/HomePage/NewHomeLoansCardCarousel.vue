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
						:selected-channel="selectedChannel"
						:loan-ids="selectedChannelLoanIds"
					/>
				</div>
			</kv-page-container>
		</template>
	</section-with-background-classic>
</template>

<script>
import { gql } from 'graphql-tag';
import KivaLoanCardCarousel from '#src/components/LoanCollections/HomeExp/KivaLoanCardCarousel';
import contentfulStylesMixin from '#src/plugins/contentful-ui-setting-styles-mixin';
import SectionWithBackgroundClassic from '#src/components/Contentful/SectionWithBackgroundClassic';
import { KvPageContainer } from '@kiva/kv-components';

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
	},
	data() {
		return {
			loanCategoryData: [],
			selectedChannel: {},
			showCarousel: false,
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
		},
		combinedLoanChannelData() {
			return this.contentfulLoanCategories.map(category => {
				const matchedLoanCategory = this.loanCategoryData.find(lc => lc.id === category.id);
				return { ...matchedLoanCategory, ...category };
			});
		},
		categoryIds() {
			return this.contentfulLoanCategories.map(categorySetting => {
				return categorySetting.id;
			});
		},
		loanQueryLimit() {
			return this.loanDisplaySettings?.loanLimit ?? 1;
		},
		selectedChannelLoanIds() {
			const selectedChannel = this.combinedLoanChannelData.find(channel => {
				return this.selectedChannel?.id === channel.id;
			});
			return selectedChannel?.loans?.values?.map(loan => loan.id) ?? [];
		},
		showViewMoreCard() {
			return this.loanDisplaySettings?.showViewMoreCard ?? false;
		}
	},
	mounted() {
		this.fetchLoanChannel();
	},
	methods: {
		fetchLoanChannel() {
			this.apollo.query({
				query: gql`query selectedLoanCategory($categoryIds: [String!]!, $loanLimit: Int) {
					categoriesByIds(ids: $categoryIds) {
						id
						name
						url
						... on LoanCategorySearchOutput {
							savedSearch(limit: $loanLimit) {
								id
								loans {
									values {
										id
									}
								}
							}
						}
					}
				}`,
				variables: {
					categoryIds: this.categoryIds,
					loanLimit: this.loanQueryLimit
				},
			}).then(result => {
				// Set All Active Loan Categories Data, flattening savedSearch so `loans` stays top level
				const categories = result?.data?.categoriesByIds ?? [];
				this.loanCategoryData = categories.map(category => {
					return { ...category, loans: category?.savedSearch?.loans ?? {} };
				});
				// Activate the first category available
				const initialChannel = this.combinedLoanChannelData[0];
				this.selectedChannel = initialChannel;
				// Make the carousel visible
				this.showCarousel = true;
			});
		}
	},
};
</script>
