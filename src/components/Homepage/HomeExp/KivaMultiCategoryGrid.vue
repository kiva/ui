<template>
	<kv-grid class="tw-grid-cols-12">
		<div class="tw-col-span-12 md:tw-col-span-3">
			<div class="tw-mr-4">
				<h4 class="tw-text-base tw-text-upper tw-mb-4">
					I want to support
				</h4>
				<loan-category-selector-home-exp
					:loan-channels="combinedLoanChannelData"
					:selected-channel="selectedChannel.id"
					@handle-category-click="handleCategoryClick"
				/>
			</div>
		</div>
		<div class="tw-col-span-12 md:tw-col-span-9 tw-mt-1.5">
			<kiva-loan-card-category
				:loan-ids="selectedChannelLoanIds"
				:selected-channel="selectedChannel"
				:loan-channels="combinedLoanChannelData"
				:new-home-exp="newHomeExp"
				:show-view-more-card="showViewMoreCard"
			/>
		</div>
	</kv-grid>
</template>

<script>
import { gql } from 'graphql-tag';
import KivaLoanCardCategory from '#src/components/LoanCollections/HomeExp/KivaLoanCardCategory';
import LoanCategorySelectorHomeExp from '#src/components/LoanCollections/HomeExp/LoanCategorySelectorHomeExp';
import { KvGrid } from '@kiva/kv-components';

export default {
	name: 'KivaMultiCategoryGrid',
	inject: ['apollo', 'cookieStore'],
	components: {
		LoanCategorySelectorHomeExp,
		KivaLoanCardCategory,
		KvGrid
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
		},
		newHomeExp: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			loanCategoryData: [],
			selectedCategoryId: '',
		};
	},
	computed: {
		combinedLoanChannelData() {
			return this.contentfulLoanCategories.map(category => {
				const matchedLoanCategory = this.loanCategoryData.find(lc => lc.id === category.id);
				return { ...matchedLoanCategory, ...category, loans: { ...matchedLoanCategory?.loans } };
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
		selectedChannel() {
			return this.combinedLoanChannelData.find(
				loanCategory => loanCategory.id === this.selectedCategoryId
			);
		},
		selectedChannelLoanIds() {
			const selectedChannel = this.combinedLoanChannelData.find(channel => {
				return this.selectedChannel?.id === channel.id;
			});
			return selectedChannel?.loans?.values?.map(loan => loan.id) ?? Array(this.loanQueryLimit).fill(0);
		},
		showViewMoreCard() {
			return this.loanDisplaySettings?.showViewMoreCard ?? false;
		}
	},
	created() {
		// Copy initial loan category data from contentful and select first category
		this.loanCategoryData = this.contentfulLoanCategories;
		[this.selectedCategoryId] = this.categoryIds;
	},
	mounted() {
		// Load data for first category
		this.fetchLoanChannel(this.selectedCategoryId);
	},
	methods: {
		handleCategoryClick(payload) {
			this.selectedCategoryId = payload.categoryId;
			this.fetchLoanChannel(this.selectedCategoryId);
		},
		fetchLoanChannel(id) {
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
					categoryIds: [id],
					loanLimit: this.loanQueryLimit
				},
			}).then(result => {
				// Get clone of loanCategoryData for modification
				const loanCategoryData = [...this.loanCategoryData];
				// Get array index of the fetched loan category for updating the data
				const categoryIndex = this.categoryIds.indexOf(id);
				// Set new category data if available, otherwise use existing data, flattening savedSearch
				const fetched = result?.data?.categoriesByIds?.[0];
				const loanCategory = fetched
					? { ...fetched, loans: fetched?.savedSearch?.loans ?? {} }
					: loanCategoryData[categoryIndex];
				loanCategoryData[categoryIndex] = loanCategory;
				this.loanCategoryData = loanCategoryData;
			});
		}
	}
};
</script>
