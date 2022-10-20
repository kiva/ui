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
						:loans="selectedChannelLoanIds"
					/>
				</div>
			</kv-page-container>
		</template>
	</section-with-background-classic>
</template>

<script>
import gql from 'graphql-tag';
import loanCardFieldsFragment from '@/graphql/fragments/loanCardFields.graphql';
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
	},
	data() {
		return {
			loanChannelData: [],
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
		},
		combinedLoanChannelData() {
			return this.contentfulLoanChannels.map(channel => {
				const matchedLoanChannel = this.loanChannelData.find(lc => lc.id === channel.id);
				return { ...matchedLoanChannel, ...channel };
			});
		},
		loanChannelIds() {
			return this.contentfulLoanChannels.map(channelSetting => {
				return channelSetting.id;
			});
		},
		loanQueryLimit() {
			return this.loanDisplaySettings?.loanLimit ?? 1;
		},
		selectedChannelLoanIds() {
			const selectedChannel = this.combinedLoanChannelData.find(channel => {
				return this.selectedChannel?.id === channel.id;
			});
			return selectedChannel?.loans.values ?? [];
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
				query: gql`
				${loanCardFieldsFragment}
				query selectedLoanCategory($loanChannelIds: [Int]!, $loanLimit: Int) {
					lend {
						loanChannelsById(ids: $loanChannelIds){
							id
							name
							url
							loans(limit: $loanLimit) {
								values {
									id
									...loanCardFields
								}
							}
						}
					}
				}`,
				variables: {
					loanChannelIds: this.loanChannelIds,
					loanLimit: this.loanQueryLimit
				},
			}).then(result => {
				// Set All Active Loan Channels Data
				const loanChannels = result?.data?.lend?.loanChannelsById ?? [];
				this.loanChannelData = loanChannels;
				// Activate the first channel available
				const initialChannel = this.combinedLoanChannelData[0];
				this.selectedChannel = initialChannel;
				// Make the carousel visible
				this.showCarousel = true;
			});
		}
	},
};
</script>
