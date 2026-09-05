<template>
	<div>
		<kiva-classic-loan-category-selector
			v-if="combinedLoanChannelData.length > 1"
			:loan-channels="combinedLoanChannelData"
			:selected-channel="selectedChannel.id"
			@handle-category-click="handleCategoryClick"
		/>
		<kiva-classic-loan-carousel
			:is-visible="showCarousel"
			:loan-ids="selectedChannelLoanIds"
			:selected-channel="selectedChannel"
			:show-view-more-card="showViewMoreCard"
		/>
	</div>
</template>

<script>
import { gql } from 'graphql-tag';
import KivaClassicLoanCarousel from '#src/components/LoanCollections/KivaClassicLoanCarousel';
import KivaClassicLoanCategorySelector from '#src/components/LoanCollections/KivaClassicLoanCategorySelector';

export default {
	name: 'KivaClassicMultiCategoryCarousel',
	inject: ['apollo', 'cookieStore'],
	components: {
		KivaClassicLoanCarousel,
		KivaClassicLoanCategorySelector,
	},
	props: {
		/**
		 * Array of loan category data in an object
		 * ex. [{ id: '43bb7beb-c666-4ff9-aa87-79b2043f8d94', shortName: 'some short name' }]
		* */
		contentfulLoanCategories: {
			type: Array,
			default: () => [],
		},
		/**
		 * Additional display settings
		 * Possible Options:
		 * loanLimit: integer that controls how many loans will be loaded for ALL channels
		* */
		loanDisplaySettings: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			loanCategoryData: [],
			selectedChannel: {},
			showCarousel: false,
		};
	},
	computed: {
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
		handleCategoryClick(payload) {
			this.selectedChannel = this.combinedLoanChannelData.find(
				loanChannel => loanChannel.id === payload.categoryId
			);
		},
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
		},
	}
};
</script>
