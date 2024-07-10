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
						:contentful-loan-channels="loanChannels"
						:loan-display-settings="loanDisplaySettings"
						:new-home-exp="true"
					/>
				</div>
			</kv-page-container>
		</template>
	</section-with-background-classic>
</template>

<script>
import { gql } from '@apollo/client';
import logReadQueryError from '@/util/logReadQueryError';
import contentfulStylesMixin from '@/plugins/contentful-ui-setting-styles-mixin';
import KivaMultiCategoryGrid from '@/components/Homepage/HomeExp/KivaMultiCategoryGrid';
import { loanFieldsFragment } from '@/components/LoanCards/NewHomePageLoanCard';
import SectionWithBackgroundClassic from '@/components/Contentful/SectionWithBackgroundClassic';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

/**
 * Extract Loan Channel settings from Contentful Ui Setting dataObject
* */
const getContentfulLoanChannels = content => {
	const uiSetting = content?.contents?.find(({ contentType }) => {
		return contentType ? contentType === 'uiSetting' : false;
	});
	return uiSetting?.dataObject?.loanChannels ?? [];
};

const loanCategoryPrefetchQuery = gql`
	${loanFieldsFragment}
	query loanCategoryPrefetch($loanChannelIds: [Int]!, $limit: Int) {
		lend {
			loanChannelsById(ids: $loanChannelIds) {
				id
				loans(limit: $limit) {
					values {
						id
						...loanFields
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
			loanChannels: [],
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
		contentfulLoanChannels() {
			return getContentfulLoanChannels(this.content);
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
			const contentfulLoanChannels = getContentfulLoanChannels(content);
			const id = contentfulLoanChannels[0]?.id;
			return client.query({
				query: loanCategoryPrefetchQuery,
				variables: {
					loanChannelIds: id ? [id] : [],
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
			const id = this.contentfulLoanChannels[0]?.id;
			data = this.apollo.readQuery({
				query: loanCategoryPrefetchQuery,
				variables: {
					loanChannelIds: id ? [id] : [],
					limit: isDesktop ? 6 : 1
				},
			});
		} catch (e) {
			logReadQueryError(e, 'NewHomeLoansByCategoryGrid loanCategoryPrefetch');
		}

		// Create an array with placeholder loans for loading
		const { loanLimit = 0 } = this.loanDisplaySettings;

		// Get the fetched loan and merge it into the placeholder loan array
		const loanChannel = data?.lend?.loanChannelsById[0] ?? { loans: { values: [] } };

		let loanValues;
		if (isDesktop) {
			loanValues = loanChannel?.loans?.values;
		} else {
			loanValues = Array(loanLimit).fill({ id: 0 });
			loanValues[0] = loanChannel?.loans?.values[0];
		}

		const loanChannelCopy = {
			...loanChannel,
			loans: {
				values: loanValues,
			},
		};

		// Set the channel with the prefetched loan
		const [firstChannel, ...otherChannels] = this.contentfulLoanChannels;
		this.loanChannels = [{ ...firstChannel, ...loanChannelCopy }, ...otherChannels];
	},
};
</script>
