<template>
	<section-with-background-classic
		:background-content="background"
		:theme-name="themeName"
		:vertical-padding="verticalPadding"
	>
		<template #content>
			<kv-page-container>
				<div>
					<kiva-multi-category-grid
						:contentful-loan-categories="loanCategories"
						:loan-display-settings="loanDisplaySettings"
						:new-home-exp="true"
					/>
				</div>
			</kv-page-container>
		</template>
	</section-with-background-classic>
</template>

<script>
import { gql } from 'graphql-tag';
import logReadQueryError from '#src/util/logReadQueryError';
import contentfulStylesMixin from '#src/plugins/contentful-ui-setting-styles-mixin';
import KivaMultiCategoryGrid from '#src/components/Homepage/HomeExp/KivaMultiCategoryGrid';
import { loanFieldsFragment } from '#src/components/LoanCards/NewHomePageLoanCard';
import SectionWithBackgroundClassic from '#src/components/Contentful/SectionWithBackgroundClassic';
import { KvPageContainer } from '@kiva/kv-components';

/**
 * Extract Loan Category settings from Contentful Ui Setting dataObject
* */
const getContentfulLoanCategories = content => {
	const uiSetting = content?.contents?.find(({ contentType }) => {
		return contentType ? contentType === 'uiSetting' : false;
	});
	return uiSetting?.dataObject?.loanCategories ?? [];
};

const loanCategoryPrefetchQuery = gql`
	${loanFieldsFragment}
	query loanCategoryPrefetch($categoryIds: [String!]!, $limit: Int) {
		categoriesByIds(ids: $categoryIds) {
			id
			... on LoanCategorySearchOutput {
				savedSearch(limit: $limit) {
					id
					loans {
						values {
							id
							...loanFields
						}
					}
				}
			}
		}
	}`;

export default {
	name: 'NewHomeLoansByCategoryGrid',
	inject: ['apollo', 'cookieStore', 'device'],
	components: {
		KivaMultiCategoryGrid,
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
			loanCategories: [],
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
		contentfulLoanCategories() {
			return getContentfulLoanCategories(this.content);
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
	},
	apollo: {
		preFetch(config, client, { content, device }) {
			const contentfulLoanCategories = getContentfulLoanCategories(content);
			const id = contentfulLoanCategories[0]?.id;
			return client.query({
				query: loanCategoryPrefetchQuery,
				variables: {
					categoryIds: id ? [id] : [],
					limit: device?.platform?.type === 'desktop' ? 6 : 1
				},
			});
		},
	},
	created() {
		// Fetch loan channel data from the cache
		let data = {};
		const isDesktop = this.device?.platform?.type === 'desktop';
		try {
			const id = this.contentfulLoanCategories[0]?.id;
			data = this.apollo.readQuery({
				query: loanCategoryPrefetchQuery,
				variables: {
					categoryIds: id ? [id] : [],
					limit: isDesktop ? 6 : 1
				},
			});
		} catch (e) {
			logReadQueryError(e, 'NewHomeLoansByCategoryGrid loanCategoryPrefetch');
		}

		// Create an array with placeholder loans for loading
		const { loanLimit = 0 } = this.loanDisplaySettings;

		// Get the fetched loan and merge it into the placeholder loan array
		const category = data?.categoriesByIds?.[0];
		const loanCategory = { ...category, loans: category?.savedSearch?.loans ?? { values: [] } };

		let loanValues;
		if (isDesktop) {
			loanValues = loanCategory?.loans?.values;
		} else {
			loanValues = Array(loanLimit).fill({ id: 0 });
			[loanValues[0]] = loanCategory?.loans?.values ?? [];
		}

		const loanCategoryCopy = {
			...loanCategory,
			loans: {
				values: loanValues,
			},
		};

		// Set the category with the prefetched loan
		const [firstCategory, ...otherCategories] = this.contentfulLoanCategories;
		this.loanCategories = [{ ...firstCategory, ...loanCategoryCopy }, ...otherCategories];
	},
};
</script>
